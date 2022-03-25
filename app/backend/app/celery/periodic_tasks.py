import os

from app.celery.File import File
from app.config.settings import AppSettings

from app.celery import tasks
from celery import chain


rt_dir = AppSettings.UploadSettings.REAL_TIME_UPLOADS
index_folder = AppSettings.UploadSettings.INDEX_FOLDER
rt_results = AppSettings.UploadSettings.REAL_TIME_RESULTS


def periodic_task_calls():
    for file_id in os.listdir(rt_dir):
        file_dir = os.path.join(rt_dir, file_id)
        file = File.load(file_dir)

        results_dir = os.path.join(rt_results, file.file_id)
        data_dir = os.path.join(results_dir, "data.json")

        for chunk in file.state.analysis_chunks:
            if chunk.status == 'Ready':
                print(f'Analyzing {file_id} chunk {chunk.chunk_number}')
                file.set_start_chunk_analysis(chunk.chunk_number)

                chain(
                    tasks.perform_chunk_analysis.s(
                        chunk.chunk_number, file_dir, file.panel, index_folder, results_dir),
                    tasks.post_process.s(data_dir, file.panel),
                ).apply_async()

        if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
            tasks.pipe_status.s(file.filename, file.file_id, os.path.join(
                file_dir, 'data.json'), file.email).apply_async()

            for filename in os.listdir(file_dir):
                file_path = os.path.join(file_dir, filename)
                try:
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                    elif os.path.isdir(file_path):
                        os.rmdir(file_path)
                except Exception as e:
                    print('Failed to delete %s. Reason: %s' % (file_path, e))

            os.rmdir(file_dir)