import os
import json

import requests

from celery import Celery
from celery.contrib import rdb

from app.scripts import salmonconfig, realtime

app = Celery('tasks')
app.config_from_object('app.celery.celeryconfig')

@app.task
def make_file_metadata(file_dir, filename, upload_chunk_size, analysis_chunk_size):
    meta_fname = '{}/meta.json'.format(file_dir)

    metadata = {
        'filename': filename,
        'upload_chunk_maxsize': upload_chunk_size,
        'analysis_chunk_maxsize': analysis_chunk_size,
        'current_analysis_chunk_number': 0,
        'current_analysis_chunk_size': 0,
        'current_line_number': 1,
    }

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

    return {'Success': True}

@app.task
def make_file_data(results_dir):
    data_fname = '{}/data.json'.format(results_dir)

    data = {'data':None}
    with open(data_fname, 'w') as f:
        json.dump(data, f)

    return {'Success': True}

@app.task
def process_new_upload(file_dir, new_chunk_number):
    meta_fname = '{}/meta.json'.format(file_dir)
    upload_data_dir = '{}/upload_data'.format(file_dir)
    analysis_data_dir = '{}/salmon_data'.format(file_dir)
    upload_chunk_fname = '{}/{}.fastq'.format(
        upload_data_dir, new_chunk_number)

    metadata = None
    with open(meta_fname) as f:
        metadata = json.load(f)

    current_analysis_chunk_number = metadata['current_analysis_chunk_number']
    current_analysis_chunk_size = metadata['current_analysis_chunk_size']

    line_number = metadata['current_line_number']
    upload_chunk_size = metadata['upload_chunk_maxsize']
    analysis_chunk_size = metadata['analysis_chunk_maxsize']

    analysis_chunk_fname = '{}/{}.fastq'.format(
        analysis_data_dir, current_analysis_chunk_number)

    # Record if a new analysis chunk is produced to trigger salmon
    chunk_to_analyze = None
    with open(analysis_chunk_fname, 'ab+') as analysis_chunk:
        with open(upload_chunk_fname, 'rb') as upload_chunk:
            data = upload_chunk.read()
            current_analysis_chunk_size += upload_chunk_size

            # if analysis chunk is full, fix truncation and move to next analysis chunk
            if current_analysis_chunk_size > analysis_chunk_size:
                # write till line number divisible by 4 aka complete record
                lines_to_complete_record = 4 - (line_number % 4) + 1
                data_to_complete_record = b'\n'.join(
                    data.split(b'\n')[:lines_to_complete_record])
                data_remaining = b'\n'.join(
                    data.split(b'\n')[lines_to_complete_record:])

                analysis_chunk.write(data_to_complete_record)

                # set chunk for salmon analysis
                chunk_to_analyze = current_analysis_chunk_number

                # write remaining data into the next analysis chunk
                current_analysis_chunk_number += 1
                current_analysis_chunk_size = 0
                next_analysis_chunk_fname = '{}/{}.fastq'.format(
                    analysis_data_dir, current_analysis_chunk_number)

                with open(next_analysis_chunk_fname, 'ab+') as next_analysis_chunk:
                    next_analysis_chunk.write(data_remaining)
            else:
                analysis_chunk.write(data)

            line_number += data.count(b'\n')

    metadata = {
        'filename': metadata['filename'],
        'upload_chunk_maxsize': upload_chunk_size,
        'analysis_chunk_maxsize': analysis_chunk_size,
        'current_analysis_chunk_number': current_analysis_chunk_number,
        'current_analysis_chunk_size': current_analysis_chunk_size,
        'current_line_number': line_number
    }

    with open(meta_fname, 'w') as f:
        json.dump(metadata, f)

    return {'Success': True,
            'Chunk_To_Analyze': chunk_to_analyze}


@app.task
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
        return {'Sucess': True,
                'Current_Analysis_Chunk': chunk_number,
                "Quant_Dir": quant_dir}
    else:
        return {'Sucess': False,
                'Current_Analysis_Chunk': None,
                'Quant_Dir': None}


@app.task
def post_process(salmon_result, data_dir, metadata_dir, panel):
    
    # configurations for post-processing
    headers = ['Name', 'TPM']
    metadata = realtime.metadata_load(metadata_dir, panel)

    # Grab datafile
    data_fname = '{}/data.json'.format(data_dir)
    data = None
    with open(data_fname) as f:
        data = json.load(f)
    
    # state vars
    quant_dir = salmon_result['Quant_Dir'] 
    current_analysis_chunk = salmon_result['Current_Analysis_Chunk']

    # only do post-processing if quant_file exists
    if quant_dir == None:
        return
    
    if data['data'] == None:
        # first quant being analyzed
        print(f"analyzing first chunk")
        first_quant = realtime.realtime_quant_analysis(quant_dir, headers, metadata)
        first_quant['Coverage'] = realtime.coverage_calc(first_quant, headers[1])
        
        data = {'data': first_quant}

        with open(data_fname, 'w') as f:
            json.dump(metadata, f)
    
    elif data['data']:
        print(f"Retrieving data from previous chunk {current_analysis_chunk -1}")
        
        # read data from previous quant file; already has coverage
        previous_chunk = data['data']
        print(realtime.coverage_summarizer(previous_chunk, headers))


        print(f"Read current data from chunk {current_analysis_chunk}")

        # read data from currentquant file and calculate coverage
        current_chunk = realtime.realtime_quant_analysis(
            quant_dir, headers, metadata)
        current_chunk['Coverage'] = realtime.coverage_calc(current_chunk, headers[1])

        print(f"Accumulating results")
        # sum results
        accumulated_results = realtime.update_analysis(
            previous_chunk, current_chunk, headers[1])
        accumulated_results['Coverage'] = realtime.coverage_calc(
            accumulated_results, headers[1])

        data = {'data': accumulated_results}

        with open(data_fname, 'w') as f:
            json.dump(metadata, f) 

if __name__ == '__main__':
    app.worker_main()
