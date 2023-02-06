import json
import pandas as pd 
from pathlib import Path
from .config import Config
from pydantic import schema_json_of
from app.models.pipelines.pipeline import Schema

SERVICE_PATH = Path(__file__).parent
PIPELINES_PATH = SERVICE_PATH / 'pipelines.json'

def initialize():
    """
    Initializes pipelines service

    Note: Should be run on startup, but can be used to update the schemas as well
    """
    # Create the schema spec
    with open(SERVICE_PATH / 'schema.json', 'w') as f:
        f.write(schema_json_of(Schema, title='Pipelines Schema', indent=4))

    # Generate the pipelines.json from the subdirectory pipelines 
    available_pipelines = {}

    pipelines = SERVICE_PATH.glob('./pipelines/*/schema.json*')
    for pipeline in pipelines:
        with open(pipeline, 'r') as p:
            data = json.loads(p.read())
        try: 
            Schema.parse_obj(data)
            available_pipelines[data['id']] = data
        except:
            # skips invalid pipeline
            continue
    
    with open(PIPELINES_PATH, 'w') as ap:
        json.dump(available_pipelines, ap, indent=2)


def get_pipeline(pipeline: str):
    """
    Returns the pipeline schema for a chosen pipeline
    """
    pipelines_path = PIPELINES_PATH
    pipelines = pd.read_json(pipelines_path)
    return pipelines[pipeline]

def configure_pipeline(meta, name, inputs, store):
    """
    Configures the pipeline according to the given spec
    """
    return Config(
        meta=meta,
        name=name,
        inputs=inputs,
        store=store,
    )

def start(pipeline, name, inputs, store):
    """
    Initialization point for running a pipeline
    """
    schema = get_pipeline(pipeline)
    container = configure_pipeline(meta=schema, name=name, inputs=inputs, store=store)
    return container
