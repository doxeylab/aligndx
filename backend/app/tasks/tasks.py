import requests
import shutil, os
from app.models.redis import MetaModel
from .redis.functions import Handler
from app.services import factory
from celery import shared_task

CELERY_API_KEY = os.getenv("CELERY_API_KEY")
API_URL = os.getenv("API_URL")

@shared_task(name="Update metadata")
def update_metadata(sub_id : str, metadata : MetaModel):
    """
    Create/Update metadata entry in redis for a new submission

    :param sub_id: UUID translated to string UUID
    :param metadata: unique Metadata Model class
    """
    Handler.create(sub_id, metadata.dict())
    return {'Success': True}

@shared_task(name="Retrive metadata")
def retrieve(sub_id : str) -> MetaModel:
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
def cleanup(sub_id: str, metadata : MetaModel):
    """
    Cleans up container and storage
    :param metadata: unique Metadata Model class
    """
    factory.destroy(metadata.id)
    for store, path in metadata.store.items():
        if store == 'uploads' or store =='temp':
            shutil.rmtree(path)
    Handler.delete(sub_id)

@shared_task(name="Status Update")
def status_update(sub_id : str, status : str):
    requests.post(f"{API_URL}/webhooks/celery/status_update", params={"sub_id": sub_id, "status": status}, headers={"Authorization": f'Bearer {CELERY_API_KEY}'})

class StatusException(Exception):
    """Raised when the pipeline is not ready
     Attributes:
        status -- status causing the error
        message -- explanation of the error
    """
    def __init__(self, status):
        self.status = status
        self.message = f'Status was {self.status}'
        super().__init__(self.message)

@shared_task(name="Status Check", bind=True, autoretry_for=(StatusException,), max_retries=None, retry_kwargs={'max_retries': None, 'countdown': 10})
def status_check(self, sub_id: str):
    metadata = retrieve.s(sub_id)()
    status = metadata.status
    container_status = factory.get_status(metadata.id)

    if status == 'setup':
        if all([inp.status == 'ready' for inp in metadata.inputs]):
            for inp in metadata.inputs:
                if inp.input_type == 'file':
                    for filename, meta in inp.file_meta.items():
                        
                        # Move and rename file to appropriate location
                        src = "{}/{}".format(metadata.store['raw_uploads'], meta.name)
                        dst = "{}/{}".format(metadata.store[inp.id], filename)
                        shutil.move(src=src, dst=dst)

                        info_id = meta.name + '.info'
                        info_src = "{}/{}".format(metadata.store['raw_uploads'], info_id)
                        info_dst = "{}/{}".format(metadata.store['temp'], info_id)
                        shutil.move(src=info_src, dst=info_dst)
                        
            factory.start(metadata.id)
            metadata.status = 'processing'
            update_metadata.s(sub_id, metadata)()

            raise StatusException(status)
        
        else:
            for inp in metadata.inputs:
                if inp.input_type == 'file':
                    ready = [meta.status == 'finished' for filename, meta in  inp.file_meta.items()] 
                    if all(ready):
                        inp.status = 'ready'
                    
            update_metadata.s(sub_id, metadata)()
            raise StatusException(status)


    if container_status == 'completed' or container_status == 'error':
        metadata.status = container_status 
        update_metadata.s(sub_id, metadata).delay()
        status_update.s(sub_id, container_status).delay()
        factory.create_report(metadata)
        cleanup.s(sub_id, metadata).delay()
        return True

    raise StatusException(status)