from celery import Celery
from app.tasks.tasks import *

app = Celery('Tasks')
app.config_from_object('app.services.celery.config')

if __name__ == '__main__':
    app.worker_main()
