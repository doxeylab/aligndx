import os
import requests
import shutil
import logging
from celery import shared_task, chain, signals
from app.models.jobs import Metadata
from app.models.enums import JobStatus
from app.services import factory
from .redis.functions import Handler

logger = logging.getLogger(__name__)

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")


class TaskResponse:
    def __init__(self, success: bool, message: str, data: dict = None):
        self.success = success
        self.message = message
        self.data = data
        self.log_message()

    def to_dict(self):
        return {"success": self.success, "message": self.message, "data": self.data}

    def log_message(self):
        log_func = logger.error if not self.success else logger.info
        log_func(f"TaskResponse created - {self.to_dict()}")


@signals.task_success.connect
def task_success_handler(sender=None, result=None, **kwargs):
    TaskResponse(True, f"Task {sender.name} succeeded", result)


@signals.task_failure.connect
def task_failure_handler(sender=None, task_id=None, exception=None, **kwargs):
    TaskResponse(False, f"Task {sender.name} failed - {str(exception)}", {})


@shared_task(name="Status Update")
def status_update(sub_id: str, status: str):
    requests.post(
        f"{API_URL}/webhooks/celery/status_update",
        params={"sub_id": sub_id, "status": status},
        headers={"Authorization": f"Bearer {CELERY_API_KEY}"},
    )


@shared_task(name="Update metadata")
def update_metadata(sub_id: str, metadata: Metadata):
    Handler.create(sub_id, metadata.dict())
    return metadata.dict()


@shared_task(name="Retrieve metadata")
def retrieve_metadata(sub_id: str) -> Metadata:
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict is not None:
        return meta_dict  # Returning actual data
    else:
        raise Exception(f"No metadata available for {sub_id}")  # Raising exception


@shared_task(name="Create Job")
def create_job(sub_id: str, name: str, pipeline: str, inputs: dict, store: dict):
    id = factory.create(pipeline=pipeline, inputs=inputs, store=store)
    metadata = Metadata(
        id=id,
        name=name,
        inputs=inputs,
        store=store,
        status=JobStatus.QUEUED,
        pipeline=pipeline,
    )
    Handler.enqueue_job(sub_id, metadata.dict())
    Handler.create(sub_id, metadata.dict())
    return metadata.dict()


@shared_task(name="Start Job")
def start_job(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = Metadata(**metadata_dict)
    factory.start(metadata.id)
    metadata.status = JobStatus.PROCESSING
    update_metadata(sub_id, metadata)
    return metadata.dict()


@shared_task(bind=True, name="Monitor Docker Status")
def monitor_docker_status(self, sub_id: str):
    container_status = factory.get_status(sub_id)
    metadata_dict = retrieve_metadata(sub_id)
    metadata = Metadata(**metadata_dict)

    if container_status in ("completed", "error"):
        metadata.status = container_status
        update_metadata(sub_id, metadata)
        return metadata.dict()
    else:
        self.apply_async((sub_id,), countdown=10)


@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = Metadata(**metadata_dict)
    factory.create_report(metadata=metadata)
    cleanup(sub_id, metadata)  # Directly calling cleanup
    return metadata.dict()


@shared_task(name="Cleanup")
def cleanup(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = Metadata(**metadata_dict)
    factory.destroy(metadata.id)
    Handler.dequeue_job(sub_id)
    for store, path in metadata.store.items():
        if store in ("uploads", "temp"):
            shutil.rmtree(path)
    Handler.delete(sub_id)
    return metadata.dict()


def run_job(sub_id):
    task_chain = chain(start_job.s(sub_id), monitor_docker_status.s(sub_id))
    callback = complete_job.s(sub_id)
    task_chain.link(callback).delay()
