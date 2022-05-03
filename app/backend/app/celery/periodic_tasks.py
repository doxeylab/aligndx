from datetime import datetime
import os
import shutil
import pandas as pd

from app.db.session import async_session
from app.services.db import get_db

from app.celery.File import File
from app.config.settings import settings

from app.celery import tasks

from app.db.dals.submissions import SubmissionsDal
from app.db.dals.users import UsersDal
from app.models.schemas.submissions import UpdateSubmissionResult, UpdateSubmissionDataUsageDate, UpdateSubmissionEmailDate

from app.scripts.email_feature import send_email
from app.scripts.process.controller import Controller

from app.services.subscription_service import update_data_usage

uploads_dir = settings.UPLOAD_FOLDER
index_dir = settings.INDEX_FOLDER
results_dir = settings.RESULTS_FOLDER


async def save_result(db, file):
    out_dir = os.path.join(results_dir, file.file_id)

    controller = Controller(file.process, file.panel, out_dir=out_dir)
    data = controller.load_data()

    sub_dal = SubmissionsDal(db)
    user_dal = UsersDal(db)

    sub = await sub_dal.get_by_id(file.file_id)
    user = await user_dal.get_by_id(sub.user_id)
    customer_id = user.customer_id

    if sub.result is None:
        result = await sub_dal.update(file.file_id, UpdateSubmissionResult(result=data))

    # if sub.data_usage_updated_date is None:
    #     now = datetime.now()

    #     await update_data_usage(db, customer_id, data_amount_mb=(sub.file_size / (1024**2)))
    #     await sub_dal.update(file.file_id, UpdateSubmissionDataUsageDate(data_usage_updated_date=now))

    if sub.email_date is None:
        now = datetime.now()

        result_link = f'/result?submission={file.file_id}'
        send_email(receiver_email=file.email,
                sample=file.filename, link=result_link)
        print(f"sent email to {file.email}")
        await sub_dal.update(file.file_id, UpdateSubmissionEmailDate(email_date=now))

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
    db = async_session()
    for file_id in os.listdir(uploads_dir):
        file_dir = os.path.join(uploads_dir, file_id)
        file = File.load(file_dir)

        await perform_file_analyses(file, file_dir)

        if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
            await save_result(db, file)
            shutil.rmtree(file_dir)
