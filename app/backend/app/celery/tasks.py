import sys
import json
from tkinter import W

from celery import Celery
from celery.contrib import rdb

app = Celery('tasks', broker='pyamqp://guest@localhost//')


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

    return True


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

    return True


if __name__ == '__main__':
    app.worker_main()
