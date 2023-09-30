import requests
import shutil, os, json
from app.models.redis import MetaModel
from .redis.functions import Handler
from app.services import factory
from celery import shared_task

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")

@shared_task(name="Update Metadata")
def update_metadata(sub_id: str, metadata: MetaModel):
    Handler.create(sub_id, json.dumps(metadata.dict()))
    return json.dumps({'Success': True})  


@shared_task(name="Retrieve Metadata")
def retrieve_metadata(sub_id: str) -> str:
    meta_dict = Handler.retrieve(sub_id)
    if meta_dict is not None:
        return meta_dict
    else:
        return json.dumps(None)


@shared_task(name="Cleanup")
def cleanup(sub_id: str):
    meta = retrieve_metadata(sub_id)
    metadata = MetaModel(**json.loads(meta))
    factory.destroy(metadata.id)
    for store, path in metadata.store.items():
        if store == 'uploads' or store == 'temp':
            shutil.rmtree(path)
    try:
        Handler.delete(sub_id)
    except:
        return 

@shared_task(name="Status Update")
def status_update(sub_id: str, status: str):
    requests.post(f"{API_URL}/webhooks/celery/status_update",
        params={"sub_id": sub_id, "status": status},
        headers={"Authorization": f'Bearer {CELERY_API_KEY}'})

@shared_task(name="Status Check", bind=True, max_retries=None)
def status_check(self, sub_id: str):
    meta = retrieve_metadata(sub_id)
    metadata = MetaModel(**meta)
    container_status = factory.get_status(metadata.id)
    
    if container_status in ['completed', 'error']:
        finalize_task(sub_id, metadata, container_status)
        return True

    if metadata.status == 'setup':
        process_setup_status(self, sub_id, metadata)
    
    else:
        self.apply_async((sub_id,), countdown=10) 


def process_setup_status(self, sub_id, metadata):
    if all(inp.status == 'ready' for inp in metadata.inputs):
        process_ready_inputs(self, sub_id, metadata)
    else:
        update_input_statuses(sub_id, metadata)
        self.apply_async((sub_id,), countdown=10) 


def process_ready_inputs(self, sub_id, metadata):    
    position = Handler.get_job_position(sub_id)
    metadata.position = position
    update_metadata.s(sub_id, metadata)()

    print(f"Position: {position}")  # Debugging print statement

    if position is not None and position == 1:
        print("Processing ready inputs...")  # Debugging print statement

        for inp in metadata.inputs:
            if inp.input_type == 'file':
                print(f"Processing file input: {inp}")  # Debugging print statement

                process_file_input(metadata, inp)

        factory.start(metadata.id)
        metadata.status = 'processing'
        update_metadata.s(sub_id, metadata)()
        self.apply_async((sub_id,), countdown=10)
    else:
        self.apply_async((sub_id,), countdown=100)


def process_file_input(metadata, inp):
    for filename, meta in inp.file_meta.items():
        move_file(
            src="{}/{}".format(metadata.store['raw_uploads'], meta.name),
            dst="{}/{}".format(metadata.store[inp.id], filename)
        )

        move_file(
            src="{}/{}.info".format(metadata.store['raw_uploads'], meta.name),
            dst="{}/{}.info".format(metadata.store['temp'], meta.name)
        )


def move_file(src, dst):
    shutil.move(src=src, dst=dst)


def update_input_statuses(sub_id, metadata):
    for inp in metadata.inputs:
        if inp.input_type == 'file' and all(meta.status == 'finished' for filename, meta in inp.file_meta.items()):
            inp.status = 'ready'
    update_metadata.s(sub_id, metadata)()


def finalize_task(sub_id, metadata, container_status):
    metadata.status = container_status
    update_metadata.s(sub_id, metadata).delay()
    status_update.s(sub_id, container_status).delay()
    factory.create_report(metadata)
    Handler.dequeue_job()
    cleanup.s(sub_id).delay()