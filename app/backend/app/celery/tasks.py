from distutils.command.upload import upload
from fileinput import filename
import os
import logging
import json
import math

import requests
import pandas as pd

from celery import Celery
from celery.contrib import rdb
from celery.utils.log import get_task_logger
from celery.signals import after_setup_logger

from app.scripts.process.Entry import Initialize

from app.celery.File import File

logger = get_task_logger(__name__)

app = Celery('tasks')
app.config_from_object('app.celery.celeryconfig')


# @after_setup_logger.connect
# def setup_loggers(logger, *args, **kwargs):
#     formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

#     # FileHandler
#     fh = logging.FileHandler('./logs.log')
#     fh.setFormatter(formatter)
#     logger.addHandler(fh)

@app.task
def make_file_metadata(file_dir, filename, upload_chunk_size, analysis_chunk_size, num_upload_chunks, email, fileId, panel):
    file = File(fileId, file_dir, filename, email, chunk_ratio=analysis_chunk_size /
                upload_chunk_size, num_upload_chunks=num_upload_chunks, panel=panel)
    file.save()

    return {'Success': True}


@app.task
def make_file_data(results_dir):
    data_fname = '{}/data.json'.format(results_dir)

    data = {}

    with open(data_fname, 'w') as f:
        json.dump(data, f)

    return {'Success': True}


@app.task(bind=True)
def process_new_upload(self, file_dir, new_chunk_number):
    file = File.load(file_dir)
    file.process_upload(new_chunk_number)

    return {'Success': True}


@app.task
def perform_chunk_analysis(process, chunk_number, file_dir, panel, results_dir):
    analysis_dir = os.path.join(file_dir, 'salmon_data')
    chunk = os.path.join(analysis_dir, f'{chunk_number}.fastq')

    process = Initialize(process=process, panel=panel, chunk_number=chunk_number, in_dir=chunk, out_dir=results_dir)
    print(process.commands)
    resp = requests.post(process.access_point, json=process.commands)

    file = File.load(file_dir)

    if resp.raise_for_status():
        file.set_analysis_error(chunk_number)

    else:
        process.post_process()
        file.set_complete_chunk_analysis(chunk_number=chunk_number)
        return {'Success': True}

if __name__ == '__main__':
    app.worker_main()
