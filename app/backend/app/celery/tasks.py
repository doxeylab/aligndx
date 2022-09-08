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

from app.scripts.process.controller import Controller

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
def make_file_metadata(file_dir, filename, upload_chunk_size, analysis_chunk_size, num_upload_chunks, email, fileId, panel, process):
    """
    Create metadata for a new file upload. Call on the creation of a live upload.

    :param file_dir: Complete path for the directory to store file data in.
    :param filename: The filename of the uploaded file.
    :param upload_chunk_size: Size (in kilobytes) of each chunk uploaded from the frontend.
    :param analysis_chunk_size: Size (in kilobytes) of each reassembled chunk to be analyzed by the tool.
    :param num_upload_chunks: Total number of upload chunks the file is divided into.
    :param email: Email of the user to notify on file completion.
    :param fileId: ID of the submission. Must be unique identifier.
    :param panel: Pathogen panel.
    :param process: Process for the analysis tool.

    """
    file = File(fileId, file_dir, filename, email, chunk_ratio=analysis_chunk_size /
                upload_chunk_size, num_upload_chunks=num_upload_chunks, panel=panel, process=process)
    file.save()

    return {'Success': True}


@app.task
def make_file_data(results_dir):
    """
    Create result data for a new file upload. Call (along with make_file_metadata) on the creation of a live upload.

    :param results_dir: Complete path for the *common* results directory for all files.

    """
    data_fname = '{}/data.json'.format(results_dir)

    data = {}

    with open(data_fname, 'w') as f:
        json.dump(data, f)

    return {'Success': True}


@app.task(bind=True)
def process_new_upload(self, file_dir, new_chunk_number):
    """
    Handle the completion of a chunk upload. Call this whenever an upload from the frontend completes.

    :param file_dir: File directory path (from make_file_metadata)
    :param new_chunk_number: The chunk number of the new upload chunk.

    """
    file = File.load(file_dir)
    file.process_upload(new_chunk_number)

    return {'Success': True}


@app.task
def perform_chunk_analysis(process, chunk_number, file_dir, panel, out_dir):
    """

    :param process: Process for the analysis tool.
    :param chunk_number: The chunk number of the ready analysis chunk.
    :param file_dir: File directory path (from make_file_metadata)
    :param panel: Pathogen panel (from make_file_metadata)
    :param out_dir: Output directory for results. v 

    """
    analysis_dir = os.path.join(file_dir, 'tool_data')
    chunk = os.path.join(analysis_dir, f'{chunk_number}.fastq')

    process = Controller(process=process, panel=panel, chunk_number=chunk_number, in_dir=chunk, out_dir=out_dir)
    print(process.commands)
    resp = requests.post(process.access_point, json=process.commands)

    file = File.load(file_dir)

    if resp.status_code == 400:
        file.set_analysis_error(chunk_number)
        return {'Success': False}

    else:
        process.post_process()
        file.set_complete_chunk_analysis(chunk_number=chunk_number)
        return {'Success': True}

if __name__ == '__main__':
    app.worker_main()
