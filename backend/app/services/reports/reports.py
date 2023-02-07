from pathlib import Path
from datetime import date

import nbformat as nbf
from nbconvert import HTMLExporter
import papermill as pm

from ...models import redis

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
    {error}

"""


def reports(metadata : redis.MetaModel):
    
    error = error_md.format(error='test') if metadata.status == 'error' else ''

    nb = nbf.v4.new_notebook()
    metadata_layout = metadata_layout_md.format(
        name = metadata.name,
        status = metadata.status,
        error = error,
        timestamp = "This report was created on {date}"
    )