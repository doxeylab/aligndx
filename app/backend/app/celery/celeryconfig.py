import os 

# broker url
broker_url = os.getenv("CELERY_BROKER_URL")

task_routes = {
    'tasks.make_file_metadata': {'queue': 'uploads'},
    'tasks.process_new_upload': {'queue': 'uploads'},
    'tasks.perform_chunk_analysis': {'queue': 'salmon'},
}
