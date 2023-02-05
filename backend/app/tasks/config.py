from app.core.config.settings import settings

# broker url
broker_url = settings.BROKER_URL

# backend url
backend_url = settings.BACKEND_RESULTS_URL

task_serializer = "pickle"
result_serializer = "pickle"
event_serializer = "json"
accept_content = ["application/json", "application/x-python-serialize"]
result_accept_content = ["application/json", "application/x-python-serialize"]