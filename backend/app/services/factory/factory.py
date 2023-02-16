import yaml
import requests
import zipfile, shutil, os, json
from glob import glob
from app.core.config.settings import settings
from app.models.pipelines.pipeline import Schema

PIPELINES_PATH = settings.PIPELINES_PATH
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

    output = "{}/{}".format(settings.DOWNLOADS_PATH,"pipelines.zip")
    
    # download pipelines
    download(
        repo=settings.PIPELINES_REPO,
        token=settings.PIPELINES_REPO_TOKEN,
        output=output
        )

    # extract then delete zip 
    with zipfile.ZipFile(output, 'r') as zip_ref:
        zip_ref.extractall(settings.DOWNLOADS_PATH)
    os.remove(output)
    
    # find pipelines subdirectory and move contents to pipelines directory
    tree = glob(settings.DOWNLOADS_PATH + "/**", recursive=True)
    repo_pipelines = [x for x in tree if x.endswith("pipelines")][0]
        
    if os.path.exists(PIPELINES_PATH):
        shutil.rmtree(PIPELINES_PATH)
        shutil.copytree(repo_pipelines, PIPELINES_PATH)

    # Read pipelines, validate them and create the available json file
    available = {}
    pipelines = glob(PIPELINES_PATH + "/**/schema.yml")
    for pipeline in pipelines:
        with open(pipeline, 'r') as p:
            data = yaml.safe_load(p)
            Schema.parse_obj(data)
            available[data['id']] = data
    
    with open(AVAILABLE, 'w') as ap:
        json.dump(available, ap, indent=2)

def get_available_pipelines():
    """
    Returns available pipelines
    """
    with open(AVAILABLE, 'r') as f:
        available_pipelines = json.loads(f.read())
    return available_pipelines