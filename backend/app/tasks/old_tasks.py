@shared_task(
    name="Status Check",
    bind=True,
    autoretry_for=(StatusException,),
    max_retries=None,
    retry_kwargs={"max_retries": None, "countdown": 10},
)
def status_check(self, sub_id: str):
    metadata = retrieve.s(sub_id)()
    status = metadata.status
    container_status = factory.get_status(metadata.id)

    if status == "setup":
        if all([inp.status == "ready" for inp in metadata.inputs]):
            for inp in metadata.inputs:
                if inp.input_type == "file":
                    for filename, meta in inp.file_meta.items():
                        # Move and rename file to appropriate location
                        src = "{}/{}".format(metadata.store["raw_uploads"], meta.name)
                        dst = "{}/{}".format(metadata.store[inp.id], filename)
                        shutil.move(src=src, dst=dst)

                        info_id = meta.name + ".info"
                        info_src = "{}/{}".format(
                            metadata.store["raw_uploads"], info_id
                        )
                        info_dst = "{}/{}".format(metadata.store["temp"], info_id)
                        shutil.move(src=info_src, dst=info_dst)

            factory.start(metadata.id)
            metadata.status = "processing"
            update_metadata.s(sub_id, metadata)()

            raise StatusException(status)

        else:
            for inp in metadata.inputs:
                if inp.input_type == "file":
                    ready = [
                        meta.status == "finished"
                        for filename, meta in inp.file_meta.items()
                    ]
                    if all(ready):
                        inp.status = "ready"

            update_metadata.s(sub_id, metadata)()
            raise StatusException(status)

    if container_status == "completed" or container_status == "error":
        metadata.status = container_status
        update_metadata.s(sub_id, metadata).delay()
        status_update.s(sub_id, container_status).delay()
        factory.create_report(metadata)
        cleanup.s(sub_id, metadata).delay()
        return True

    raise StatusException(status)


import requests
import shutil, os
from app.models.jobs import Metadata
from app.models.enums import JobStatus

from .redis.functions import Handler
from app.services import factory
from celery import shared_task, chain

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")

import logging

logger = logging.getLogger(__name__)


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

    def __call__(self, *args, **kwargs):
        return self.to_dict()

    def __repr__(self):
        return str(self.to_dict())


@shared_task(name="Update metadata")
def update_metadata(sub_id: str, metadata: Metadata):
    Handler.create(sub_id, metadata.dict())
    return TaskResponse(True, message="Metadata updated/created")


@shared_task(name="Retrive metadata")
def retrieve_metadata(sub_id: str) -> Metadata:
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict != None:
        return TaskResponse(True, message="Metadata retrieved", data=meta_dict)
    else:
        return TaskResponse(False, message=f"No metadata available for {sub_id}")


@shared_task(name="Status Update")
def status_update(sub_id: str, status: str):
    requests.post(
        f"{API_URL}/webhooks/celery/status_update",
        params={"sub_id": sub_id, "status": status},
        headers={"Authorization": f"Bearer {CELERY_API_KEY}"},
    )


@shared_task(name="Create Job")
def create_job(
    sub_id: str,
    name: str,
    pipeline: str,
    inputs: dict,
    store: dict,
):
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
    return TaskResponse(True, message="Job created", data=metadata.dict())


@shared_task(name="Start Job")
def start_job(sub_id: str):
    try:
        metadata = retrieve_metadata(sub_id)
        factory.start(metadata.id)
        metadata.status = JobStatus.PROCESSING
        update_metadata(sub_id, metadata)
        return TaskResponse(True, message="Job started", data=metadata.dict())
    except Exception as e:
        return TaskResponse(False, message="Job could not start", data=metadata.dict())


@shared_task(name="Start Job")
def start_job(sub_id: str):
    try:
        metadata_response = retrieve_metadata(sub_id)
        if not metadata_response.success:
            raise Exception("Could not retrieve metadata")
        metadata = Metadata(**metadata_response.data)
        factory.start(metadata.id)
        metadata.status = JobStatus.PROCESSING
        update_metadata(sub_id, metadata)
        return TaskResponse(True, "Job started", metadata.dict())
    except Exception as e:
        return TaskResponse(False, str(e))


@shared_task(bind=True, name="Monitor Docker Status")
def monitor_docker_status(self, sub_id: str):
    try:
        container_status = factory.get_status(sub_id)
        metadata = retrieve_metadata(sub_id)

        if container_status in ("completed", "error"):
            metadata.status = container_status
            update_metadata(sub_id, metadata)
            return TaskResponse(
                True,
                message=f"Job finished processing with status {container_status}",
                data=metadata.dict(),
            )
        else:
            self.apply_async((sub_id,), countdown=10)
    except Exception as e:
        return TaskResponse(False, message="Error in monitoring", data=metadata.dict())


@shared_task(name="Complete Job")
def complete_job(sub_id: str):
    try:
        metadata = retrieve_metadata(sub_id)
        factory.create_report(metadata=metadata)
        return TaskResponse(
            True,
            message="Created job report",
            data=metadata.dict(),
        )
    except Exception as e:
        return TaskResponse(
            False,
            message="Could not generate a report",
            data=metadata.dict(),
        )
    finally:
        cleanup(sub_id, metadata)


@shared_task(name="Cleanup")
def cleanup(sub_id: str):
    metadata = retrieve_metadata(sub_id)
    factory.destroy(metadata.id)
    Handler.dequeue_job(sub_id)
    for store, path in metadata.store.items():
        if store == "uploads" or store == "temp":
            shutil.rmtree(path)
    Handler.delete(sub_id)
    return TaskResponse(
        True,
        message="Cleaned up job",
        data=metadata.dict(),
    )


def run_job(sub_id):
    task_chain = chain(
        start_job.s(sub_id), monitor_docker_status.s(sub_id), complete_job.s(sub_id)
    )
    task_chain()
