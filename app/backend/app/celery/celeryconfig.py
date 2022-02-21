import os 

# broker url
broker_url = os.getenv("CELERY_BROKER_URL")

task_routes = {
    'app.celery.tasks.make_file_metadata': {'queue': 'uploads'},
    'app.celery.tasks.process_new_upload': {'queue': 'uploads'},
    'app.celery.tasks.perform_chunk_analysis': {'queue': 'salmon'},
    'app.celery.tasks.post_process' : {'queue': 'downstream'},
    'app.celery.tasks.grab_current_data' : {'queue': 'downstream'}
}
