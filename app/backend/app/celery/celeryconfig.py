import os 

# broker url
broker_url = os.getenv("CELERY_BROKER_URL")

# backend url
backend_url = os.getenv("CELERY_RESULT_BACKEND")

task_routes = {
    'app.celery.tasks.make_file_metadata': {'queue': 'uploads'},
    'app.celery.tasks.make_file_data': {'queue': 'uploads'},
    'app.celery.tasks.process_new_upload': {'queue': 'uploads'},
    'app.celery.tasks.perform_chunk_analysis': {'queue': 'salmon'},
    'app.celery.tasks.post_process' : {'queue': 'downstream'},
    'app.celery.tasks.pipe_status': {'queue': 'downstream'}
}
