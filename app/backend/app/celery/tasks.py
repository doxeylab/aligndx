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

from app.scripts import salmonconfig, realtime, email_feature

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
    meta_fname = '{}/meta.json'.format(file_dir)

    upload_chunks = [{
        'Name': '{}.fastq'.format(i),
        'Status': 'Waiting'
    } for i in range(num_upload_chunks)]

    chunk_ratio = analysis_chunk_size / upload_chunk_size
    num_analysis_chunks = math.ceil(num_upload_chunks / chunk_ratio)
    upload_chunks_deps = []
    for i in range(1, num_analysis_chunks + 1):
        start_chunk = math.ceil((i-1) * chunk_ratio)
        end_chunk = math.ceil(i * chunk_ratio)

        if i == num_analysis_chunks:
            end_chunk = num_upload_chunks

        upload_chunks_deps.append(list(range(start_chunk, end_chunk)))

    analysis_chunks = [{
        'Name': '{}.fastq'.format(i),
        'Residue_Name': '{}_residue.fastq'.format(i),
        'Upload_Chunks_Required': upload_chunks_deps[i - 1],
        'Status': 'Waiting',
        'Residue_Status': 'Waiting'
    } for i in range(1, num_analysis_chunks +1)]

    metadata = {
        'filename': filename,
        'upload_chunk_maxsize': upload_chunk_size,
        'analysis_chunk_maxsize': analysis_chunk_size,
        'upload_chunks': upload_chunks,
        'analysis_chunks': analysis_chunks,
        'analysis_chunks_processed' : 0,
        'total_analysis_chunks' : num_analysis_chunks,
        'email' : email,
        'fileId': fileId    
    }

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

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
    meta_fname = '{}/meta.json'.format(file_dir)
    upload_data_dir = '{}/upload_data'.format(file_dir)
    analysis_data_dir = '{}/salmon_data'.format(file_dir)

    metadata = None
    with open(meta_fname) as f:
        metadata = json.load(f)

    metadata['upload_chunks'][new_chunk_number]['Status'] = 'Uploaded'

    chunk_to_analyze = None
    for indx, analysis_chunk in enumerate(metadata['analysis_chunks']):
        if analysis_chunk['Status'] == 'Waiting':

            # check to see if necessary residues are ready for analysis chunk assembly
            # A note that we should look into assembling on the fly, rather than waiting
            # A simple version could be to write all the residues on the fly, and when this conditions is true, assemble them 
            if all([metadata['upload_chunks'][i]['Status'] == 'Uploaded' for
                    i in analysis_chunk['Upload_Chunks_Required']]):
                residual_data = None

                # start writing analysis chunk with appropriate residues
                with open(os.path.join(analysis_data_dir, analysis_chunk['Name']), 'w') as af:
                    for relative_num, upload_chunk_num in enumerate(analysis_chunk['Upload_Chunks_Required']):
                        upload_chunk_fname = os.path.join(upload_data_dir,
                                                          metadata['upload_chunks'][upload_chunk_num]['Name'])
                        with open(upload_chunk_fname) as uf:
                            data = None
                            if relative_num == 0:
                                data = uf.read()

                                lines = data.split('\n')
                                # a single plus is always the 3nd whole line of a sequence
                                first_plus_line = lines.index('+')
                                # adding 2 modulo 4 to the line number would give us the first line of a sequence
                                sequence_start_line = ((first_plus_line + 2) % 4) + 4

                                data = '\n'.join(lines[sequence_start_line:])
                                residual_data = '\n'.join(
                                    lines[:sequence_start_line])
                            else:
                                data = uf.read()
                            af.write(data)

                        os.remove(upload_chunk_fname)

                if indx > 0 : 
                    # check to see if the previous analysis chunk has truncation, if so write to the current chunk
                    if metadata['analysis_chunks'][indx-1]['Status'] == 'Residue_Remaining':
                        prev_chunk_name = metadata['analysis_chunks'][indx-1]['Name']
    
                        with open(os.path.join(analysis_data_dir, prev_chunk_name), 'a') as af:
                            af.write(residual_data)
    
                        metadata['analysis_chunks'][indx-1]['Status'] = 'Ready'
                        chunk_to_analyze = indx

    
                    # otherwise declare the residues to be finished
                    else:
                        prev_chunk_residue_name = metadata['analysis_chunks'][
                            indx - 1]['Residue_Name']
    
                        with open(os.path.join(analysis_data_dir, prev_chunk_residue_name), 'w') as af:
                            af.write(residual_data)
    
                        metadata['analysis_chunks'][indx -
                                                    1]['Residue_Status'] = 'Ready'
    
                    # if there is data remaining, change the status of the analysis chunk
                if metadata['analysis_chunks'][indx]['Residue_Status'] == 'Waiting' and indx + 1 != len(metadata['analysis_chunks']):
                    metadata['analysis_chunks'][indx]['Status'] = 'Residue_Remaining'

                # otherwise, declare the analysis chunk be ready to analyzed
                else:
                    if indx + 1 != len(metadata['analysis_chunks']):
                        with open(os.path.join(analysis_data_dir, analysis_chunk['Name']), 'a') as af:
                            with open(os.path.join(analysis_data_dir, analysis_chunk['Residue_Name'])) as  rf:
                                af.write(rf.read())
                    metadata['analysis_chunks'][indx]['Status'] = 'Ready'

                    chunk_to_analyze = indx + 1

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

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


@app.task(throws=(SalmonMemoryError,),autoretry_for=(SalmonMemoryError,), retry_backoff=5)
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
def post_process(salmon_result, data_dir, metadata_dir, panel):

    # only do post-processing if quant_file exists
    if salmon_result is None:
        return

    # state vars
    quant_dir = salmon_result['Quant_Dir']
    chunk_number = salmon_result['Chunk_To_Analyze']

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
        logger.warning("Retrieving previous data")

        # read data from previous quant file; already has coverage
        previous_chunk = data
        previous_chunk.set_index('Pathogen', inplace=True)
        logger.warning(realtime.coverage_summarizer(previous_chunk, headers))

        logger.warning(
            f"Reading current data from chunk {chunk_number}")

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

    return {"Success": True,
            "Chunk_Analyzed": chunk_number}

@app.task
def pipe_status(pipe_result, file_dir):

    last_chunk_analyzed = pipe_result['Chunk_Analyzed']

    meta_fname = '{}/meta.json'.format(file_dir)

    metadata = None
    with open(meta_fname) as f:
        metadata = json.load(f)

    analysis_chunks_processed = metadata['analysis_chunks_processed']
    total_analysis_chunks = metadata['total_analysis_chunks']

    if analysis_chunks_processed == (total_analysis_chunks - 2):
        
        fileId = metadata['fileId']
        
        save_request = {"fileId": fileId}
        requests.post("http://backend:8080/uploads/save_result", data = save_request)

        reciever = metadata['email']
        sample = metadata['filename']
        result_link = f'/result?submission={fileId}'

        print(f"sending email to {reciever}")
        email_feature.send_email(receiver_email=reciever, sample=sample, link=result_link)
    
    else:
        analysis_chunks_processed += 1
        metadata = {**metadata,"analysis_chunks_processed": analysis_chunks_processed}
        with open(meta_fname, 'w') as f:
            json.dump(metadata, f)

    return {"Last_Chunk_Analzyed": last_chunk_analyzed,
            "Analysis_Chunks_Processed": analysis_chunks_processed,
            }

if __name__ == '__main__':
    app.worker_main()
