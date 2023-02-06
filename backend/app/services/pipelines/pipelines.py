import pandas as pd 
from pathlib import Path
from .config import Config

def generate_pipelines():
    pass

def get_pipelines():
    pipelines_path = Path(__file__).parent / "pipelines.json"
    
    return pd.read_json(pipelines_path)

def get_pipeline_schema(pipeline: str):
    pipelines = get_pipelines()
    return pipelines['pipelines'][pipeline]

def configure_pipeline(meta, name, inputs, store):
    return Config(
        meta=meta,
        name=name,
        inputs=inputs,
        store=store,
    )

def start(pipeline, name, inputs, store):
    schema = get_pipeline_schema(pipeline)
    container = configure_pipeline(meta=schema, name=name, inputs=inputs, store=store)
    return container
