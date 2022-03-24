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

from app.scripts import salmonconfig 
from app.scripts.post_processing.Analyze import AnalyzeQuant 

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
def make_file_metadata(file_dir, filename, upload_chunk_size, analysis_chunk_size, num_upload_chunks, email, fileId):
    file = File(fileId, file_dir, filename, email, chunk_ratio=analysis_chunk_size /
                upload_chunk_size, num_upload_chunks=num_upload_chunks)

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
    chunks_to_analyze = file.process_upload(new_chunk_number)

    chunk_to_analyze = chunks_to_analyze[-1] if len(chunks_to_analyze) > 0 else None

    if chunk_to_analyze is None:
        self.request.chain = None

    else:
        return {'Success': True,
                'Chunk_To_Analyze': chunk_to_analyze}


class SalmonMemoryError(Exception):
    """Exception raised for salmon not outputting quant files, due to memory availability

    Attributes:
        None
    """

    def __init__(self, dir, message="Salmon did not complete correctly"):
        self.dir = dir
        self.message = message
        super().__init__(self.message)


@app.task(throws=(SalmonMemoryError,), autoretry_for=(SalmonMemoryError,), retry_backoff=5)
def perform_chunk_analysis(upload_result, panel, index_folder, analysis_dir, real_time_results):
    chunk_number = upload_result['Chunk_To_Analyze']

    if chunk_number is None:
        return

    indexpath = os.path.join(index_folder, panel + "_index")
    chunk = "{}/{}.fastq".format(analysis_dir, chunk_number)
    results_dir = "{}/{}".format(real_time_results, chunk_number)

    commands = salmonconfig.commands(indexpath, chunk, results_dir)

    with requests.Session() as s:
        s.post("http://salmon:80/", json=commands)

    quant_dir = "{}/quant.sf".format(results_dir)

    if os.path.isfile(quant_dir):
        os.remove(chunk)

        return {'Success': True,
                'Chunk_To_Analyze': chunk_number,
                'Quant_Dir': quant_dir}
    else:
        raise SalmonMemoryError(quant_dir)


@app.task
def post_process(salmon_result, data_dir, panel):

    # only do post-processing if quant_file exists
    if salmon_result is None:
        return

    # state vars
    quant_dir = salmon_result['Quant_Dir']
    chunk_number = salmon_result['Chunk_To_Analyze']

    # configurations for post-processing
    headers = ['Name', 'TPM']

    quant = AnalyzeQuant(panel, quant_dir, headers, data_dir)
    quant.accumulate()
    
    return {"Success": True,
            "Chunk_Analyzed": chunk_number}


@app.task
def pipe_status(pipe_result, file_dir, data_dir):

    last_chunk_analyzed = pipe_result['Chunk_Analyzed']
    meta_fname = '{}/meta.json'.format(file_dir)

    metadata = None
    with open(meta_fname) as f:
        metadata = json.load(f)

    fileName = metadata['filename']
    email = metadata['email']

    analysis_chunks_processed = metadata['analysis_chunks_processed']
    total_analysis_chunks = metadata['total_analysis_chunks']

    if analysis_chunks_processed == (total_analysis_chunks - 2):

        fileId = metadata['fileId']

        end_request = {
            "fileName": fileName,
            "fileId": fileId,
            "data_dir": data_dir,
            "email": email
        }

        requests.post("http://backend:8080/end_pipe", json=end_request)

    else:
        analysis_chunks_processed += 1
        metadata = {**metadata,
                    "analysis_chunks_processed": analysis_chunks_processed}
        with open(meta_fname, 'w') as f:
            json.dump(metadata, f)

    return {
        "Last_Chunk_Analzyed": last_chunk_analyzed,
        "Analysis_Chunks_Processed": analysis_chunks_processed,
    }


if __name__ == '__main__':
    app.worker_main()
