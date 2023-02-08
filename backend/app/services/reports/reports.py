from pathlib import Path
from datetime import date

import subprocess
import nbformat as nbf
from nbconvert import HTMLExporter
import papermill as pm

from ...models import redis
from ..pipelines import get_pipeline

TEMPLATE_PATH = Path(__file__).parent / 'template.html'

REPORT_CONFIG = {
    "exclude_input": True,
    "exclude_output_prompt": True,
    "exclude_input_prompt": True,
} 

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

def book_combiner(books):
    metadata = []
    merged = nbf.v4.new_notebook()

    for nb in books:
        metadata.append(nb.metadata)
        merged.cells.extend(nb.cells)

        merged_metadata = {}
        for meta in reversed(metadata):
            merged_metadata.update(meta)
        merged.metadata = merged_metadata

    return merged   

def cell_combiner(nb, condition):
    """
    Combines cell according to a certain condition function

    Note: In the case of this package, its purpose is to move parameterized cells to the appropriate location
    """
    to_combine = []
    for cell in nb.cells:
        if condition(cell):
            to_combine.append(cell)

    # Combine the cells
    combined_source = ""
    combined_metadata = []
    for cell in to_combine:
        combined_source += cell.source
        combined_metadata.append(cell.metadata)
        nb.cells.remove(cell)
    merged_cell_metadata = {}
    for cm in reversed(combined_metadata):
        merged_cell_metadata.update(cm)
    
    # Create and insert new cell
    new_cell = nbf.v4.new_code_cell(combined_source)
    new_cell.metadata = merged_cell_metadata
    nb.cells.insert(0, new_cell)

def create_parameters(inputs, pipeline_schema):
    report_inputs = pipeline_schema.get('report_inputs')
    if report_inputs:
        parameters = {**inputs, **report_inputs}
    else:
        parameters = {**inputs}

    return parameters


def create_report(metadata : redis.MetaModel):
    """
    Generates a report for the pipeline
    """
    pipeline_schema, pipeline_assets = get_pipeline(metadata.pipeline)

    logs_path = "{}/{}".format(metadata.store['results'],"logs.txt")
    pattern = '/Caused by:/,/Command executed:/{/Command executed:/!p};/Command exit status:/,/Work dir:/{/Work dir:/!p}'
    error = error_md.format(error=get_errors(logs_path), pattern=pattern) if metadata.status == 'error' else ''

    meta_nb = nbf.v4.new_notebook()
    metadata_layout = metadata_layout_md.format(
        name = metadata.name,
        status = metadata.status,
        error = error,
        pipeline = metadata.pipeline,
        timestamp = "This report was created on {date}".format(date=date.today())
    )
    meta_nb['cells'] = [nbf.v4.new_markdown_cell(metadata_layout)]
    
    results = metadata.store['results']
    inputs = {inp.id: inp.values for inp in metadata.inputs}
    parameters = create_parameters(inputs, pipeline_schema)

    pipeline_nb = nbf.read(pipeline_assets / 'report.ipynb', as_version=4)
    book = book_combiner([meta_nb,pipeline_nb])
    cell_combiner(book,condition=(lambda x: True if x['metadata'].get('tags') and 'parameters' in x['metadata'].get('tags') else False))
    
    try:
        final_nb = pm.execute.execute_notebook(book, None, parameters=parameters, cwd=results, progress_bar=False)
        html_exporter = HTMLExporter(template_file=TEMPLATE_PATH)

        (body, resources) = html_exporter.from_notebook_node(
            final_nb, {"metadata": {"name": f"{metadata.pipeline.capitalize()} report"}}
        )

        with open(f'{results}/report.html', "w") as o:
            o.write(body)
    except Exception as e:
        print(e)