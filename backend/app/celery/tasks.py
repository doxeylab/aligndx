import docker 
import shutil, json, subprocess, glob, os
from app.models.schemas.redis import MetaModel
from app.redis.functions import Handler
from app.utils import dir_generator
from app.scripts import nextflow

from celery import Celery, group, chain
client = docker.from_env()

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

@app.task(name="Retrive metadata")
def retrieve(subId : str):
    meta_dict = Handler.retrieve(subId)
    if meta_dict != None:
        return MetaModel(**meta_dict) 
    else:
        return None

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

@app.task(name="Signal Upload Finish")
def signal_upload_finish(name):
    """
    Send upload finish signal to pipeline

    """
    with open(name, 'w') as f:
        pass

    return {'Success': True}

@app.task(name="Run Command")
def run_command(command):
    p = subprocess.Popen(['/bin/bash', '-c', command], stdout=subprocess.PIPE, stderr=subprocess.PIPE) 
    stdout, stderr = p.communicate()
    output = {
        "stdout": stdout.read().decode(),
        "stderr": stderr.read().decode()
    }
    return output 

@app.task(name="Assemble chunks")
def assemble_chunks(updir,tooldir, total, filename):
    command = f"cat {updir}/{{0..{total - 1}}}* >{tooldir}/{filename}"
    p = subprocess.Popen(['/bin/bash', '-c', command]) 
    
@app.task(name="Cleanup")
def cleanup(metadata : MetaModel, cleanup_command: str):
    container = client.containers.get(metadata.container_id)
    container.exec_run(cmd=cleanup_command)
    container.remove(v=True)
    shutil.rmtree(metadata.dirs['updir'])
    shutil.rmtree(metadata.dirs['tdir'])

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

@app.task(name="Status Check", bind=True, autoretry_for=(StatusException,), max_retries=None, retry_kwargs={'max_retries': None, 'countdown': 1})
def status_check(self, subId: str):
    metadata = retrieve.s(subId)()
    container = client.containers.get(metadata.container_id)
    status = metadata.status

    if nextflow.directory_is_ready(log_location=metadata.dirs['tdir'], history_location=metadata.dirs['ddir']):
            execution = nextflow.Execution.create_from_location(log_location=metadata.dirs['tdir'], history_location=metadata.dirs['ddir'])
            processes = execution.process_executions
            if len(processes) > 0:
                for process in processes:
                    process_name = process.process.split(":")[-1]
                    metadata.processes[process_name] = process.status
        
    if container.status == 'exited':
        # check exit code 
        successful_containers = client.containers.list(all=True,filters={'exited':0})
        for cntr in successful_containers:
            if cntr.id == container.id:
                metadata.status = 'completed'
                update_metadata.s(subId, metadata)()
                cleanup_command = f'nextflow clean -f {execution.id}'
                cleanup.s(metadata, cleanup_command)()

                return True

            else:
                status = 'error'
                metadata.status = status
                update_metadata.s(subId, metadata)()
                raise StatusException(status)
    
    if container.status == 'running':
        metadata.status = 'analyzing'

        update_metadata.s(subId, metadata)()

    raise StatusException(status)


# Workflows using Celery Canvas
# Setup Flow
def setup_flow(subId : str, metadata: MetaModel):
    res = group(
        update_metadata.s(subId, metadata)
        )()

# Updater Analysis Flow
def update_flow(tusdata: dict, uploads_folder: str):
    # get upload info
    fileId = tusdata['ID']
    subId = tusdata['MetaData']['subId'] 
    fname = tusdata['MetaData']['name']

    # retrieve metadata
    metadata = retrieve.s(subId)()

    # move and rename files to submission folder
    files = glob.glob(uploads_folder + f'/{fileId}*')
    for file in files:
        dst = metadata.dirs["updir"] 
        curr_name = os.path.basename(file)
        segments = curr_name.split('.')

        file_name = fname
        if len(segments) > 1 : 
            file_name = fname + '.' + segments[1]
            dst = metadata.dirs["tdir"] + '/upload_info'
            dir_generator([dst])

        shutil.move(file, dst + f'/{file_name}')

    # update metadata for uploaded files
    items = metadata.items
    items[fname].uploaded = True
    metadata.items = items
    metadata.status = 'uploading'
    update_metadata.s(subId, metadata)()

    uploaded = []
    for k,v in items.items():
        uploaded.append(v.uploaded)
    
    if all(uploaded):
        # signal_upload_finish.s(f'{dst}/STOP.txt')()
        container = client.containers.get(metadata.container_id)
        container.start()
        status_check.s(subId).delay()   


# Chunk Flow
def chunk_flow(subId : str):
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
