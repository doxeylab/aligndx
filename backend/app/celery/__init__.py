from celery import Celery

app = Celery("Tasks")
app.config_from_object("app.celery.config")
app.autodiscover_tasks(["app.celery.tasks"])

if __name__ == "__main__":
    app.worker_main()