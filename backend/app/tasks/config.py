from app.core.config.settings import settings

broker_url = settings.BROKER_URL
backend_url = settings.BACKEND_RESULTS_URL

task_serializer = "json"
result_serializer = "json"
event_serializer = "json"
accept_content = ["application/json"]
result_accept_content = ["application/json"]