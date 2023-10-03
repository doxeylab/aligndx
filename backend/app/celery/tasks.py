import os
import requests
import logging
from celery import shared_task

from app.models.status import SubmissionStatus
from .redis.functions import Handler
from app.models.stores import BaseStores
from app.storages import StorageManager
from app.models.redis import MetaModel
from app.services import factory

logger = logging.getLogger(__name__)

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")


@shared_task(name="Status Update")
def status_update(sub_id: str, status: str):
    requests.post(
        f"{API_URL}/webhooks/celery/status_update",
        params={"sub_id": sub_id, "status": status},
        headers={"Authorization": f"Bearer {CELERY_API_KEY}"},
    )


@shared_task(name="Update metadata")
def update_metadata(sub_id: str, metadata: MetaModel):
    Handler.create(sub_id, metadata.json())
    status_update(sub_id, metadata.status)
    return metadata.json()


@shared_task(name="Retrieve metadata")
def retrieve_metadata(sub_id: str):
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict is not None:
        return meta_dict  # Returning actual data
    else:
        raise Exception(f"No metadata available for {sub_id}")  # Raising exception


@shared_task(name="Move data")
def move_data(submission_id: str, source_filename: str, destination_filename: str):
    storage_manager = StorageManager()
    storage_manager.move(
        src_store=BaseStores.UPLOADS,
        src_filename=source_filename,
        dest_filename=f"{submission_id}/{destination_filename}",
        dest_store=BaseStores.SUBMISSION_DATA,
    )

    tus_meta = f"{source_filename}.info"
    storage_manager.delete(store=BaseStores.UPLOADS, filename=tus_meta)

@shared_task(name="Get Job Position")
def get_job_position(submission_id: str):
    return Handler.get_job_position(submission_id)


@shared_task(name="Create Job")
def create_job(submission_id: str, name: str, pipeline_id: str, user_inputs: dict):
    metadata = MetaModel(
        id=None,
        status=SubmissionStatus.CREATED,
        inputs=user_inputs,
        name=name,
        pipeline_id=pipeline_id,
        position=None,
        submission_id=submission_id,
    )

    update_metadata(submission_id, metadata)
    metadata_json = metadata.json()
    return metadata_json


@shared_task(name="Clean Up")
def cleanup(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = MetaModel(**metadata_dict)
    factory.destroy(metadata.id, sub_id)
    Handler.dequeue_job(sub_id)

@shared_task(name="Queue Job")
def queue_job(submission_id: str):
    metadata_dict = retrieve_metadata(submission_id)
    metadata = MetaModel(**metadata_dict)
    Handler.enqueue_job(submission_id)
    position = Handler.get_job_position(submission_id)
    job_id = factory.create(
        pipeline=metadata.pipeline_id,
        inputs=metadata.inputs,
        submission_id=submission_id
    )

    metadata.position = position
    metadata.status = SubmissionStatus.QUEUED
    metadata.id = job_id

    update_metadata(submission_id, metadata)
    metadata_json = metadata.json()
    return metadata_json

@shared_task(name="Start Job")
def start_job(submission_id: str):
    metadata_dict = retrieve_metadata(submission_id)
    metadata = MetaModel(**metadata_dict)
    factory.start(metadata.id)
    update_metadata(submission_id, metadata)
    metadata_json = metadata.json()
    return metadata_json


@shared_task(bind=True, name="Monitor Job Status")
def monitor_job_status(self, submission_id: str):
    metadata_dict = retrieve_metadata(submission_id)
    metadata = MetaModel(**metadata_dict)

    status = factory.get_status(metadata.id)
    print(status)

    submission_status = SubmissionStatus.PROCESSING

    if 'exited' == status['Status']:
        exit_code = status['ExitCode']
        if exit_code == 0:
            submission_status = SubmissionStatus.COMPLETED
        else:
            submission_status = SubmissionStatus.ERROR

        metadata.status = submission_status
        update_metadata(submission_id, metadata)
        complete_job.delay(submission_id)

    else:
        metadata.status = submission_status
        update_metadata(submission_id, metadata)

        self.apply_async((submission_id,), countdown=10)
        return 
    
@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = MetaModel(**metadata_dict)

    factory.create_report(metadata)
    cleanup.delay(sub_id)
    metadata_json = metadata.json()
    return metadata_json

@shared_task(bind=True, name="Run Job")
def run_job(self, submission_id: str):
    job_position = get_job_position(submission_id)
    if job_position is None or job_position != 1:
        self.apply_async((submission_id,), countdown=60) 
        return
    
    start_job_result = start_job(submission_id)
    monitor_job_status.apply_async(args=(submission_id,))
