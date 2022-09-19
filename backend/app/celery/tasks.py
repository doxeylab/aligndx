from typing import Literal
import os, shutil, json, requests
from app.models.schemas.redis import MetaModel

from app.redis.functions import Handler
from app.flows.analysis import analysis_pipeline

from celery import Celery, group, chain

app = Celery('tasks')
app.config_from_object('app.celery.celeryconfig')

@app.task
def update_metadata(fileId : str, metadata : MetaModel):
    """
    Create metadata entry in redis for a new file upload. Called using setup workflow

    :param fileId: UUID translated to string UUID
    :param metadata: unique Metadata Model class

    """
    Handler.create(fileId, metadata.dict())
    return {'Success': True}

@app.task
def make_file_data(results_dir):
    """
    Create result data for a new file upload. Call (along with make_file_metadata) on the creation of a live upload.

    :param results_dir: Complete path for the *common* results directory for all files.

    """
    data_fname = '{}/data.json'.format(results_dir)

    data = {}

    with open(data_fname, 'w') as f:
        json.dump(data, f)

    return {'Success': True}


@app.task(bind=True)
def process_new_upload(self, file_dir, new_chunk_number):
    """
    Handle the completion of a chunk upload. Call this whenever an upload from the frontend completes.

    :param file_dir: File directory path (from make_file_metadata)
    :param new_chunk_number: The chunk number of the new upload chunk.

    """
    file = File.load(file_dir)
    file.process_upload(new_chunk_number)

    return {'Success': True}

@app.task(name="Retrive metadata")
def retrieve(fileId : str):
    meta_dict = Handler.retrieve(fileId)
    return MetaModel(**meta_dict)

@app.task(name="Assemble chunks")
def assemble_chunks(updir,tooldir, total, filename):
    os.system(f"cat {updir}/{{0..}}{total}* > {tooldir}/{filename}") 

@app.task(name="Cleanup")
def cleanup(fileId: str, metadata : MetaModel, type : Literal['chunks', 'all']):
    if type == 'chunks':
        shutil.rmtree(metadata.updir)
    else:
        shutil.rmtree(metadata.tooldir)
        shutil.rmtree(metadata.rdir)
        Handler.delete(fileId)

# Workflows using Celery Canvas
# Setup Flow
def setup_flow(fileId : str, metadata: MetaModel, results_dir : str):
    group(
        update_metadata(fileId, metadata),
        make_file_data)

# Analysis Flow
def analysis_flow(fileId : str):
    metadata = retrieve.s(fileId)
    
    if metadata.processed == metadata.total + 1:
        chain(
        assemble_chunks(metadata.updir, metadata.tooldir, metadata.total, metadata.fname),
        cleanup(metadata, 'chunks', fileId),
        analysis_pipeline(metadata.tooldir, metadata.rdir)
        )
    else:
        metadata.processed = metadata.processed + 1
        update_metadata.s(fileId, metadata)

if __name__ == '__main__':
    app.worker_main()
