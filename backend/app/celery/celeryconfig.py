from app.config.settings import settings

# broker url
broker_url = settings.BROKER_URL

# backend url
backend_url = settings.BACKEND_RESULTS_URL

task_routes = {
    'app.celery.tasks.update_metadata': {'queue': 'short'},
    'app.celery.tasks.retrieve': {'queue': 'short'},
    'app.celery.tasks.make_file_data': {'queue': 'short'},
    'app.celery.tasks.status_update': {'queue': 'short'},
    'app.celery.tasks.cleanup': {'queue': 'medium'},
    'app.celery.tasks.status_check': {'queue': 'medium'},

}
task_serializer = "pickle"
result_serializer = "pickle"
event_serializer = "json"
accept_content = ["application/json", "application/x-python-serialize"]
result_accept_content = ["application/json", "application/x-python-serialize"]