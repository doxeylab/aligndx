from typing import Literal
import shutil, json, subprocess
from app.models.schemas.redis import MetaModel

from app.redis.functions import Handler

from celery import Celery, group, chain

app = Celery('tasks')
app.config_from_object('app.celery.celeryconfig')

@app.task(name="Update metadata")
def update_metadata(subId : str, metadata : MetaModel):
    """
    Create/Update metadata entry in redis for a new file upload. Called using setup workflow

    :param subId: UUID translated to string UUID
    :param metadata: unique Metadata Model class

    """
    Handler.create(subId, metadata.dict())
    return {'Success': True}

@app.task(name="Make file data")
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

@app.task(name="Signal Finish")
def signal_finish(name):
    """
    Send finish signal to pipeline

    """
    with open(name, 'w') as f:
        pass

    return {'Success': True}

@app.task(name="Retrive metadata")
def retrieve(subId : str):
    meta_dict = Handler.retrieve(subId)
    return MetaModel(**meta_dict)

@app.task(name="Assemble chunks")
def assemble_chunks(updir,tooldir, total, filename):
    command = f"cat {updir}/{{0..{total - 1}}}* >{tooldir}/{filename}"
    p = subprocess.Popen(['/bin/bash', '-c', command]) 
    
@app.task(name="Cleanup")
def cleanup(subId: str, metadata : MetaModel, type : Literal['chunks', 'all']):
    if type == 'chunks':
        shutil.rmtree(metadata.updir)
    else:
        shutil.rmtree(metadata.tooldir)
        shutil.rmtree(metadata.rdir)
        Handler.delete(subId)

# Workflows using Celery Canvas
# Setup Flow
def setup_flow(subId : str, metadata: MetaModel, results_dir : str):
    res = group(
        update_metadata.s(subId, metadata),
        make_file_data.s(results_dir))()

# Analysis Flow
def update_flow(subId : str, fname: str):
    metadata = retrieve.s(subId)()

    items = metadata.items

    items[fname].uploaded = True

    uploaded = []
    for k,v in items.items():
        uploaded.append(v.uploaded)
    
    if all(uploaded):
        signal_finish.s('STOP.txt')()
    
    return metadata


# Analysis Flow
def analysis_flow(subId : str):
    metadata = retrieve.s(subId)()
    
    if metadata.processed == metadata.total - 1:
        # last chunk to process
        # chain using immutable signatures so we don't add previous results as arguments

        metadata.processed = metadata.processed + 1

        res = chain(
        # assemble_chunks.si(metadata.updir, metadata.tooldir, metadata.total, metadata.fname),
        # cleanup.si(subId, metadata, 'chunks'),
        # analysis_pipeline.si(metadata.tooldir, metadata.rdir)
        update_metadata.si(subId, metadata)
        )()
        return res.get()
    else:
        metadata.processed = metadata.processed + 1
        update_metadata.s(subId, metadata)()

if __name__ == '__main__':
    app.worker_main()
