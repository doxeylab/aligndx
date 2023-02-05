from celery import Celery
from .tasks import update_metadata, retrieve, cleanup, status_update, status_check

app = Celery('Tasks')
app.config_from_object('app.services.celery.config')

if __name__ == '__main__':
    app.worker_main()
