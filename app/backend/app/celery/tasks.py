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

from app.scripts import salmonconfig, realtime

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
def make_file_metadata(file_dir, filename, upload_chunk_size, analysis_chunk_size, num_upload_chunks):
    meta_fname = '{}/meta.json'.format(file_dir)

    upload_chunks = [{
        'Name': '{}.fastq'.format(i),
        'Status': 'Waiting'
    } for i in range(num_upload_chunks)]

    chunk_ratio = analysis_chunk_size / upload_chunk_size

    analysis_chunks = [{
        'Name': '{}.fastq'.format(i),
        'Residue_Name': '{}_residue.fastq'.format(i),
        'Upload_Chunks_Required': range(math.ceil((i-1) * chunk_ratio) + 1,
                                        math.ceil(i * chunk_ratio) + 1),
        'Status': 'Waiting'
    } for i in range(1, math.ceil(num_upload_chunks * chunk_ratio) + 1)]

    metadata = {
        'filename': filename,
        'upload_chunk_maxsize': upload_chunk_size,
        'analysis_chunk_maxsize': analysis_chunk_size,
        'upload_chunks': upload_chunks,
        'analysis_chunks': analysis_chunks
    }

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

    return {'Success': True}


@ app.task
def make_file_data(results_dir):
    data_fname = '{}/data.json'.format(results_dir)

    data = {}

    with open(data_fname, 'w') as f:
        json.dump(data, f)

    return {'Success': True}


@ app.task(bind=True)
def process_new_upload(self, file_dir, new_chunk_number):
    meta_fname = '{}/meta.json'.format(file_dir)
    upload_data_dir = '{}/upload_data'.format(file_dir)
    analysis_data_dir = '{}/salmon_data'.format(file_dir)
    upload_chunk_fname = '{}/{}.fastq'.format(
        upload_data_dir, new_chunk_number)

    metadata = None
    with open(meta_fname) as f:
        metadata = json.load(f)

    upload_chunk_size = metadata['upload_chunk_maxsize']
    analysis_chunk_size = metadata['analysis_chunk_maxsize']

    metadata['upload_chunks'][new_chunk_number]['Status'] = 'Uploaded'

    chunk_to_analyze = None
    for indx, analysis_chunk in enumerate(metadata['analysis_chunks']):
        if all([upload_chunk['Status'] == 'Uploaded' for
                upload_chunk in analysis_chunk['Upload_Chunks_Required']]):
            with open(os.path.join(analysis_data_dir, analysis_chunk['Name'])) as af:
                for upload_chunk in analysis_chunk['Upload_Chunks_Required']:
                    with open(os.path.join(upload_data_dir, upload_chunk['Name'])) as uf:
                        af.write(uf.read())

            metadata['analysis_chunks'][indx]['Status'] = 'Written'
            chunk_to_analyze = indx

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

    if chunk_to_analyze is None:
        self.request.chain = None

    else:
        return {'Success': True,
                'Last_Upload_Chunk_Processed': new_chunk_number,
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


@ app.task(autoretry_for=(SalmonMemoryError,))
def perform_chunk_analysis(upload_result, panel, index_folder, analysis_dir, real_time_results):
    chunk_number = upload_result['Chunk_To_Analyze']
    upload_chunk_number = upload_result['Last_Upload_Chunk_Processed']

    if chunk_number is None:
        return

    indexpath = os.path.join(index_folder, panel + "_index")
    chunk = "{}/{}.fastq".format(analysis_dir, chunk_number)
    results_dir = "{}/{}".format(real_time_results, chunk_number)

    commands = salmonconfig.commands(indexpath, chunk, results_dir)

    with requests.Session() as s:
        s.post("http://salmon:80/", json=commands)

    os.remove(chunk)

    quant_dir = "{}/quant.sf".format(results_dir)

    if os.path.isfile(quant_dir):
        return {'Success': True,
                'Current_Analysis_Chunk': chunk_number,
                'Last_Upload_Chunk_Processed': upload_chunk_number,
                'Quant_Dir': quant_dir}
    else:
        raise SalmonMemoryError(quant_dir)


@ app.task
def post_process(salmon_result, data_dir, metadata_dir, panel):

    # only do post-processing if quant_file exists
    if salmon_result is None:
        return

    # state vars
    quant_dir = salmon_result['Quant_Dir']
    current_analysis_chunk = salmon_result['Current_Analysis_Chunk']
    last_upload_chunk_analyzed = salmon_result['Last_Upload_Chunk_Processed']

    # # configurations for post-processing
    headers = ['Name', 'TPM']
    metadata = realtime.metadata_load(metadata_dir, panel)

    # Grab datafile
    data_fname = '{}'.format(data_dir)
    data = None
    try:
        with open(data_fname) as f:
            data = pd.read_json(f, orient="table")
    except:
        data = None

    if data is None:
        # first quant being analyzed
        logger.warning('Analyzing first chunk')
        first_quant = realtime.realtime_quant_analysis(
            quant_dir, headers, metadata)
        first_quant['Coverage'] = realtime.coverage_calc(
            first_quant, headers[1])
        first_quant.reset_index(inplace=True)

        with open(data_fname, 'w') as f:
            first_quant.to_json(f, orient="table")

    else:
        logger.warning(
            f"Retrieving data from previous chunk {current_analysis_chunk -1}")

        # read data from previous quant file; already has coverage
        previous_chunk = data
        previous_chunk.set_index('Pathogen', inplace=True)
        logger.warning(realtime.coverage_summarizer(previous_chunk, headers))

        logger.warning(
            f"Reading current data from chunk {current_analysis_chunk}")

        # read data from currentquant file and calculate coverage
        current_chunk = realtime.realtime_quant_analysis(
            quant_dir, headers, metadata)
        current_chunk['Coverage'] = realtime.coverage_calc(
            current_chunk, headers[1])

        logger.warning(f"Accumulating results")
        # sum results
        accumulated_results = realtime.update_analysis(
            previous_chunk, current_chunk, headers[1])
        accumulated_results['Coverage'] = realtime.coverage_calc(
            accumulated_results, headers[1])

        accumulated_results.reset_index(inplace=True)

        with open(data_fname, 'w') as f:
            accumulated_results.to_json(f, orient="table")

    return {"Success": True}


if __name__ == '__main__':
    app.worker_main()
