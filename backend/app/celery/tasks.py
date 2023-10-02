from distutils.command import clean
import os
from re import sub
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
    position = Handler.enqueue_job(submission_id)
    job_id = factory.create(
        pipeline=pipeline_id,
        inputs=user_inputs,
        submission_id=submission_id
    )
    metadata = MetaModel(
        id=job_id,
        status=SubmissionStatus.QUEUED,
        inputs=user_inputs,
        name=name,
        pipeline_id=pipeline_id,
        position=position,
        submission_id=submission_id,
    )

    metadata_json = metadata.json()
    Handler.create(submission_id, metadata_json)
    return metadata_json


@shared_task(name="Clean Up")
def cleanup(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = MetaModel(**metadata_dict)
    
    Handler.dequeue_job(sub_id)
    factory.destroy(metadata.id, sub_id)

@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    metadata_dict = retrieve_metadata(sub_id)
    metadata = MetaModel(**metadata_dict)

    factory.create_report(metadata)
    cleanup.delay(sub_id)
    metadata_json = metadata.json()
    return metadata_json


@shared_task(name="Start Job")
def start_job(submission_id: str):
    metadata_dict = retrieve_metadata(submission_id)
    metadata = MetaModel(**metadata_dict)
    metadata.status = SubmissionStatus.PROCESSING

    factory.start(metadata.id)
    update_metadata(submission_id, metadata)
    metadata_json = metadata.json()
    return metadata_json


@shared_task(bind=True, name="Monitor Job Status")
def monitor_job_status(self, submission_id: str, _):
    metadata_dict = retrieve_metadata(submission_id)
    metadata = MetaModel(**metadata_dict)

    status = factory.get_status(metadata.id)

    if status in ("completed", "error"):
        if status == 'completed':
            metadata.status = SubmissionStatus.COMPLETED
        else:
            metadata.status = SubmissionStatus.ERROR
        update_metadata(submission_id, metadata)
        complete_job.delay(submission_id)

        metadata_json = metadata.json()
        return metadata_json
    else:
        self.apply_async((submission_id,), countdown=10)


from celery import shared_task

@shared_task(bind=True, name="Run Job")
def run_job(self, submission_id: str):
    try:
        start_job_result = start_job(submission_id)
        monitor_job_status.apply_async(args=(submission_id,))
        
    except Exception as e:
        cleanup.delay(submission_id)
