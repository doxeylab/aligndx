import yaml
import requests
import zipfile
import shutil
import os
import json
from glob import glob
from app.core.config.settings import settings
from app.models.pipelines.pipeline import Schema
from app.models.stores import BaseStores
from app.storages.storage_manager import StorageManager
from .config import Config
from .reports import draft_report

import docker
client = docker.from_env()

PIPELINES_PATH = settings.BASE_STORES[BaseStores.PIPELINES]
DOWNLOADS_PATH = settings.BASE_STORES[BaseStores.DOWNLOADS]

AVAILABLE = PIPELINES_PATH + "/available.json"

def download(repo,token, output):
    """
    Downloads a github repository, and optionally
    """
    r = requests.get(
        'https://api.github.com/repos/{repo}/zipball'.format(repo=repo),
        headers={
        'accept': 'application/vnd.github.v3.raw',
        'authorization': 'token {}'.format(token)
        }
        )
    with open(output, 'wb') as f:
        f.write(r.content)
    return 
    

def initialize():
    """
    Initializes pipelines service

    Note: Should be run on startup, but can be used to update the service as well
    """
    
    if os.path.exists(AVAILABLE) is False:
    
        output = "{}/{}".format(DOWNLOADS_PATH,"pipelines.zip")
        # download pipelines
        download(
            repo=settings.PIPELINES_REPO,
            token=settings.PIPELINES_REPO_TOKEN,
            output=output
            )

        # extract then delete zip 
        with zipfile.ZipFile(output, 'r') as zip_ref:
            zip_ref.extractall(DOWNLOADS_PATH)
        os.remove(output)
        
        # find pipelines subdirectory and move contents to pipelines directory
        tree = glob(DOWNLOADS_PATH + "/**", recursive=True)
        repo_pipelines = [x for x in tree if x.endswith("pipelines")][0]
        
        try:
            shutil.copytree(repo_pipelines, PIPELINES_PATH)
        except:
            pass 
        
        # Read pipelines, validate them and create the available json file
        available = {}
        pipelines = glob(PIPELINES_PATH + "/**/schema.yml")
        for pipeline in pipelines:
            with open(pipeline, 'r') as p:
                data = yaml.safe_load(p)
                try:
                    Schema.parse_obj(data)
                    available[data['id']] = data
                    client.images.pull(data["image"])
                except:
                    continue
        with open(AVAILABLE, 'w') as ap:
            json.dump(available, ap, indent=2)

def get_available_pipelines():
    """
    Returns available pipelines
    """
    with open(AVAILABLE, 'r') as f:
        available_pipelines = json.loads(f.read())
    return available_pipelines

def get_pipeline(pipeline: str):
    """
    Returns the pipeline schema for a chosen pipeline
    """
    pipelines = get_available_pipelines()
    return pipelines[pipeline]
 
def create(pipeline, inputs, submission_id):
    """
    Initialization point for running a pipeline
    """
    schema = get_pipeline(pipeline)
    storage = StorageManager(submission_id)
    config = Config(schema=schema, inputs=inputs, storage=storage)
    return config.container.id
    
def start(id):
    container = client.containers.get(id)
    container.start()
    return

def get_status(id):
    container = client.containers.get(id)
    status = container.status
    if status == "exited":
        successful_containers = client.containers.list(all=True,filters={'exited':0})
        if any(x.id == id for x in successful_containers):
            status = 'completed'
        else:
            status = 'error'

    return status

def get_logs(id):
    container = client.containers.get(id)
    return container.logs() 
 
def destroy(id):
    container = client.containers.get(id)
    container.remove() 
    return

def create_report(metadata):
    """
    Generates a report for the pipeline
    """
    logs_path = "{}/{}".format(metadata.store['results'],"logs.txt")
    with open(logs_path, 'wb') as f:
        f.write(get_logs(metadata.id))
    
    pipeline_path = PIPELINES_PATH + "/" + metadata.pipeline
    schema = get_pipeline(metadata.pipeline)

    draft_report(
        metadata=metadata,
        logs_path=logs_path,
        schema=schema,
        pipeline_path=pipeline_path
    )
    return 
    