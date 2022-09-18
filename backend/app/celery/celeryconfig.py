import os 
from app.config.settings import settings

# broker url
broker_url = settings.BROKER_URL

# backend url
backend_url = settings.BACKEND_RESULTS_URL

task_routes = {
    'app.celery.tasks.make_file_metadata': {'queue': 'uploads'},
    'app.celery.tasks.make_file_data': {'queue': 'uploads'},
    'app.celery.tasks.process_new_upload': {'queue': 'uploads'},
    'app.celery.tasks.perform_chunk_analysis': {'queue': 'salmon'}
}
