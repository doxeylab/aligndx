import os 
from app.config.settings import settings

# broker url
broker_url = settings.BROKER_URL

# backend url
backend_url = settings.BACKEND_RESULTS_URL

task_routes = {
    'app.celery.tasks.update_metadata': {'queue': 'short'},
    'app.celery.tasks.retrieve': {'queue': 'short'},
    'app.celery.tasks.make_file_data': {'queue': 'short'},
    'app.celery.tasks.assemble_chunks': {'queue': 'medium'},
    'app.celery.tasks.cleanup': {'queue': 'medium'},
    'app.celery.tasks.analyze': {'queue': 'long'}
}
