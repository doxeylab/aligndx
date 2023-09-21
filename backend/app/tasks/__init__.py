from celery import Celery
from .tasks import (
    update_metadata,
    retrieve_metadata,
    cleanup,
    create_job,
    start_job,
    monitor_docker_status,
    complete_job,
    job_workflow,
)

app = Celery("Tasks")
app.config_from_object("app.tasks.config")

if __name__ == "__main__":
    app.worker_main()
