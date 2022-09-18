from typing import Literal
from prefect import flow, task
import os, shutil
from app.models.schemas.redis import MetaModel

from app.redis.functions import Handler
from app.flows.analysis import analysis_pipeline

@task(name="Update metadata")
def update_metadata(fileId : str, metadata : MetaModel):
    Handler.create(fileId, metadata.dict())

@task(name="Retrive metadata")
def retrieve(fileId : str):
    meta_dict = Handler.retrieve(fileId)
    return MetaModel(**meta_dict)

@task(name="Assemble chunks")
def assemble_chunks(updir,tooldir, total, filename):
    os.system(f"cat {updir}/{{0..}}{total}* > {tooldir}/{filename}") 

@task(name="Cleanup")
def cleanup(fileId: str, metadata : MetaModel, type : Literal['chunks', 'all']):
    if type == 'chunks':
        shutil.rmtree(metadata.updir)
    else:
        shutil.rmtree(metadata.tooldir)
        shutil.rmtree(metadata.rdir)
        Handler.delete(fileId)

@flow(name="Pipeline",
    description="Chunking and Analysis pipeline")
def pipeline(fileId : str):
    metadata = retrieve(fileId)
    
    if metadata.processed == metadata.total + 1:
        assemble_chunks(metadata.updir, metadata.tooldir, metadata.total, metadata.fname)
        cleanup(metadata, 'chunks', fileId)
        analysis_pipeline(metadata.tooldir, metadata.rdir)
    else:
        metadata.processed = metadata.processed + 1
        update_metadata(fileId, metadata)