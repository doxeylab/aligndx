from prefect import flow, task
import os, shutil
from pydantic import BaseModel

from app.redis.functions import Handler
from app.flows.analysis import analysis_pipeline

class MetaModel(BaseModel):
    updir: str
    rdir: str
    tooldir: str
    fname: str
    total: int
    processed: int 

@task(name="Update metadata")
def update_metadata(fileId : str, metadata : MetaModel):
    Handler.create(fileId, metadata)

@task(name="Retrive metadata")
def retrieve(fileId : str):
    return Handler.retrieve(fileId)

@task(name="Assemble chunks")
def assemble_chunks(updir,tooldir, total, filename):
    os.system(f"cat {updir}/{{0..}}{total}* > {tooldir}/{filename}") 

@task(name="Cleanup")
def cleanup(fdir):
    shutil.rmtree(fdir)

@flow(name="Pipeline",
    description="Chunking and Analysis pipeline")
def pipeline(fileId : str):
    metadata = retrieve(fileId)
    
    if metadata['processed'] == metadata['total']:
        assemble_chunks(metadata['updir'], metadata['tooldir'], metadata['total'], metadata['fname'])
        cleanup(metadata['updir'])
        analysis_pipeline(metadata['tooldir'], metadata['rdir'])
    else:
        metadata['processed'] += 1
        update_metadata(metadata)