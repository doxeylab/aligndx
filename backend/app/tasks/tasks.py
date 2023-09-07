import requests
import shutil, os
from app.models.redis import MetaModel
from app.models.enums import JobStatus

from .redis.functions import Handler
from app.services import factory
from celery import shared_task, chain

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")


@shared_task(name="Update metadata")
def update_metadata(sub_id: str, metadata: MetaModel):
    """
    Create/Update metadata entry in redis for a new submission

    :param sub_id: UUID translated to string UUID
    :param metadata: unique Metadata Model class
    """
    Handler.create(sub_id, metadata.dict())
    return {"Success": True}


@shared_task(name="Retrive metadata")
def retrieve_metadata(sub_id: str) -> MetaModel:
    """
    Retrieve metadata entry in redis for submission

    :param sub_id: UUID translated to string UUID
    """
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict != None:
        return MetaModel(**meta_dict)
    else:
        return None


@shared_task(name="Cleanup")
def cleanup(sub_id: str, metadata: MetaModel):
    """
    Cleans up container and storage
    :param metadata: unique Metadata Model class
    """
    factory.destroy(metadata.id)
    for store, path in metadata.store.items():
        if store == "uploads" or store == "temp":
            shutil.rmtree(path)
    Handler.delete(sub_id)


@shared_task(name="Status Update")
def status_update(sub_id: str, status: str):
    requests.post(
        f"{API_URL}/webhooks/celery/status_update",
        params={"sub_id": sub_id, "status": status},
        headers={"Authorization": f"Bearer {CELERY_API_KEY}"},
    )

@shared_task(name="Start Job")
def start_job(sub_id: str):
    metadata = retrieve_metadata(sub_id) 
    factory.start(metadata.id)
    metadata.status = JobStatus.QUEUED
    update_metadata(sub_id, metadata) 

@shared_task(bind=True, name="Monitor Docker Status")
def monitor_docker_status(self, sub_id: str):
    container_status = factory.get_status(sub_id)
    metadata = retrieve_metadata(sub_id)
    metadata.status = JobStatus.PROCESSING
    update_metadata(sub_id, metadata)

    if container_status in ("completed", "error"):
        metadata.status = container_status
        update_metadata(sub_id, metadata)
    else:
        self.apply_async((sub_id,), countdown=10)

@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    metadata = retrieve_metadata(sub_id)
    factory.create_report(metadata=metadata)
    cleanup(sub_id, metadata)

def job_workflow(sub_id):
    return chain(
        start_job.s(sub_id),
        monitor_docker_status.s(
            sub_id
        )
    )