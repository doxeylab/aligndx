import os
import shutil 
import pandas as pd

from app.db.session import async_session

from app.celery.File import File
from app.config.settings import settings

from app.celery import tasks
from celery import chain

from app.db.dals.submissions import SubmissionsDal
from app.models.schemas.submissions import UpdateSubmissionResult

from app.scripts.email_feature import send_email
from app.scripts import realtime

rt_dir = settings.REAL_TIME_UPLOADS
index_folder = settings.INDEX_FOLDER
rt_results = settings.REAL_TIME_RESULTS


async def save_result(file):
    db = async_session()

    results_dir = os.path.join(rt_results, file.file_id)
    data_dir = os.path.join(results_dir, "data.json")

    stored_data = pd.read_json(data_dir, orient="table")
    headers = ['Gene', 'TPM']

    data = realtime.data_loader(stored_data, file.filename, headers, status="ready")

    sub_dal = SubmissionsDal(db)
    result = await sub_dal.update(file.file_id, UpdateSubmissionResult(result=data))

    result_link = f'/result?submission={file.file_id}'
    send_email(receiver_email=file.email, sample=file.filename, link=result_link)
    print(f"sent email to {file.email}")

    return {"Result": "OK"}


# async def clean_file_upload(file_dir):
#     for filename in os.listdir(file_dir):
#         file_path = os.path.join(file_dir, filename)
#         try:
#             if os.path.isfile(file_path):
#                 os.remove(file_path)
#             elif os.path.isdir(file_path):
#                 os.rmdir(file_path)
#         except Exception as e:
#             print('Failed to delete %s. Reason: %s' % (file_path, e))
            
#     os.rmdir(file_dir)


async def perform_file_analyses(file, file_dir):
    results_dir = os.path.join(rt_results, file.file_id)
    data_dir = os.path.join(results_dir, "data.json")

    for chunk in file.state.analysis_chunks:
        if chunk.status == 'Ready':
            print(f'Analyzing {file.file_id} chunk {chunk.chunk_number}')
            file.set_start_chunk_analysis(chunk.chunk_number)

            chain(
                tasks.perform_chunk_analysis.s(
                    chunk.chunk_number, file_dir, file.panel, index_folder, results_dir),
                tasks.post_process.s(data_dir, file.panel),
            ).apply_async()


async def periodic_task_calls():
    for file_id in os.listdir(rt_dir):
        file_dir = os.path.join(rt_dir, file_id)
        file = File.load(file_dir)

        await perform_file_analyses(file, file_dir)

        if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
            await save_result(file)
            shutil.rmtree(file_dir)
