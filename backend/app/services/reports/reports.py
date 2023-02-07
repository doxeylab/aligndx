from pathlib import Path
from datetime import date

import subprocess
import nbformat as nbf
from nbconvert import HTMLExporter
import papermill as pm

from ...models import redis
from ..pipelines import get_pipeline

TEMPLATE_PATH = Path(__file__).parent / 'template.html'

metadata_layout_md = """
# Metadata
    Run : {name} 
    Status: {status}
    Pipeline: {pipeline}
{error}
{timestamp}
"""

error_md = """

## Oops ... looks like there was an error
<!-- language: none -->
    {error}

"""

def get_errors(file, pattern):
    errors = subprocess.run([
        "sed",
        "-n",
        pattern,
        file
    ], 
    capture_output=True)
    return errors.stdout.decode('utf-8')

def create_report(metadata : redis.MetaModel):
    
    pipeline_schema, pipeline_assets = get_pipeline(metadata.pipeline)

    logs_path = "{}/{}".format(metadata.store['results'],"logs.txt")
    pattern = '/Caused by:/,/Command executed:/{/Command executed:/!p};/Command exit status:/,/Work dir:/{/Work dir:/!p}'
    error = error_md.format(error=get_errors(logs_path), pattern=pattern) if metadata.status == 'error' else ''

    nb = nbf.v4.new_notebook()
    metadata_layout = metadata_layout_md.format(
        name = metadata.name,
        status = metadata.status,
        error = error,
        timestamp = "This report was created on {date}".format(date=date.today())
    )
    nb['cells'] = [
        nbf.v4.new_markdown_cell(metadata_layout_md),
        ]
    
    report_parameters = pipeline_schema['report_inputs']
    report_assets = pipeline_assets / 'reports' 