import os
import shutil 
import pandas as pd

from app.db.session import async_session

from app.celery.File import File
from app.config.settings import settings

from app.celery import tasks

from app.db.dals.submissions import SubmissionsDal
from app.models.schemas.submissions import UpdateSubmissionResult

from app.scripts.email_feature import send_email
from app.scripts.process.controller import Controller

uploads_dir = settings.UPLOAD_FOLDER
index_dir = settings.INDEX_FOLDER
results_dir = settings.RESULTS_FOLDER

async def save_result(file):
    db = async_session()

    out_dir = os.path.join(results_dir, file.file_id)

    controller =Controller(file.process, file.panel, out_dir=out_dir) 
    data = controller.load_data()

    sub_dal = SubmissionsDal(db)
    result = await sub_dal.update(file.file_id, UpdateSubmissionResult(result=data))

    result_link = f'/result?submission={file.file_id}'
    send_email(receiver_email=file.email, sample=file.filename, link=result_link)
    print(f"sent email to {file.email}")

    return {"Result": "OK"}

async def perform_file_analyses(file, file_dir):
    out_dir = os.path.join(results_dir, file.file_id)

    for chunk in file.state.analysis_chunks:
        if chunk.status == 'Ready':
            print(f'Analyzing {file.file_id} chunk {chunk.chunk_number}')
            file.set_start_chunk_analysis(chunk.chunk_number)
            print(chunk.chunk_number)
            tasks.perform_chunk_analysis.s(
                    file.process, chunk.chunk_number, file_dir, file.panel, out_dir).apply_async()


async def periodic_task_calls():
    for file_id in os.listdir(uploads_dir):
        file_dir = os.path.join(uploads_dir, file_id)
        file = File.load(file_dir)

        await perform_file_analyses(file, file_dir)

        if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
            await save_result(file)
            shutil.rmtree(file_dir)
