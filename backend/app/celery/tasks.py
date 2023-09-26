import os
import requests
import logging
from celery import shared_task, chain, signals
from app.models.submissions import SubmissionMetadata, SubmissionStatus
from app.services.workflows import WorkflowOrchestrator
from .redis.functions import Handler
from app.models.stores import BaseStores
from app.services.storages import StorageManager

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
def update_metadata(sub_id: str, metadata: SubmissionMetadata):
    Handler.create(sub_id, metadata.dict())
    status_update(sub_id, metadata.status)
    return metadata.dict()


@shared_task(name="Retrieve metadata")
def retrieve_metadata(sub_id: str):
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict is not None:
        return meta_dict  # Returning actual data
    else:
        raise Exception(f"No metadata available for {sub_id}")  # Raising exception


@shared_task(name="Create Job")
def move_data(submission_id: str, source_filename: str, destination_filename: str):
    storage_manager = StorageManager(prefix=submission_id)

    storage_manager.move(
        src_store=BaseStores.UPLOADS,
        src_filename=source_filename,
        dest_filename=destination_filename,
        dest_store=BaseStores.SUBMISSIONS,
    )

    tus_meta = f"{source_filename}.info"
    storage_manager.delete(store=BaseStores.UPLOADS, filename=tus_meta)


@shared_task(name="Create Job")
def create_job(submission_id: str, workflow_id: str, name: str, user_inputs: dict):
    workflow_orchestrator = WorkflowOrchestrator()

    job_id = workflow_orchestrator.create_job(
        workflow_id=workflow_id,
        user_inputs=user_inputs,
    )
    metadata = SubmissionMetadata(
        submission_id=submission_id,
        workflow_id=workflow_id,
        job_id=job_id,
        name=name,
        inputs=user_inputs,
        status=SubmissionStatus.QUEUED,
    )
    Handler.enqueue_job(submission_id, metadata.dict())
    Handler.create(submission_id, metadata.dict())
    return metadata.dict()


@shared_task(name="Start Job")
def start_job(submission_id: str):
    workflow_orchestrator = WorkflowOrchestrator()

    metadata_dict = retrieve_metadata(submission_id)
    metadata = SubmissionMetadata(**metadata_dict)
    metadata.status = SubmissionStatus.PROCESSING

    workflow_orchestrator.run_job(metadata.job_id)
    update_metadata(submission_id, metadata)

    return metadata.dict()


@shared_task(bind=True, name="Monitor Job Status")
def monitor_job_status(self, submission_id: str):
    workflow_orchestrator = WorkflowOrchestrator()

    metadata_dict = retrieve_metadata(submission_id)
    metadata = SubmissionMetadata(**metadata_dict)

    status = workflow_orchestrator.get_job_status(job_id=metadata.job_id)

    if status in ("completed", "error"):
        metadata.status = status
        update_metadata(submission_id, metadata)
        return metadata.dict()
    else:
        self.apply_async((submission_id,), countdown=10)


@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    workflow_orchestrator = WorkflowOrchestrator()

    metadata_dict = retrieve_metadata(sub_id)
    metadata = SubmissionMetadata(**metadata_dict)

    workflow_orchestrator.complete_job(metadata.job_id)
    Handler.dequeue_job()
    Handler.delete(sub_id)
    return metadata.dict()


def run_job(sub_id):
    task_chain = chain(start_job.s(sub_id), monitor_job_status.s(sub_id))  # type: ignore
    callback = complete_job.s(sub_id)  # type: ignore
    task_chain.link(callback).delay()
