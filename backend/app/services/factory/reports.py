from pathlib import Path
from datetime import date
import shutil, os, subprocess
from app.storages.storage_manager import StorageManager

import nbformat as nbf
from nbconvert import HTMLExporter
import papermill as pm

TEMPLATE_PATH = Path(__file__).parent / 'template.html'

REPORT_CONFIG = {
    "exclude_input": True,
    "exclude_output_prompt": True,
    "exclude_input_prompt": True,
} 

metadata_layout_md = """
# Metadata

```
Run : {name} 
Status: {status}
Created: {timestamp}
```
{error}
"""

error_md = """
# Error
```bash    
{error}
```
"""

code = """
import pandas as pd 
pd.set_option('display.max_rows', None, 'display.max_columns', None)
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

def draft_report(logs_path, metadata, schema, pipeline_path, out_nb, results):
    """
    Generates a report for the pipeline
    """
    # pattern = schema.get("logs_pattern")
    pattern = '/Caused by:/,${p;/Command executed/q}'

    if pattern:
        error = error_md.format(error=get_errors(logs_path, pattern=pattern)) if metadata.status == 'error' else ''

    meta_nb = nbf.v4.new_notebook()
    metadata_layout = metadata_layout_md.format(
        name = metadata.name,
        status = metadata.status,
        error = error,
        timestamp = date.today()
    )
    meta_nb['cells'] = [
        nbf.v4.new_markdown_cell(metadata_layout),
        nbf.v4.new_code_cell(code)]
     
    parameters = create_parameters(metadata.inputs, schema)

    pipeline_nb = nbf.read(pipeline_path + "/" + 'report.ipynb', as_version=4)

    book = book_combiner([meta_nb,pipeline_nb])
    cell_combiner(book,condition=(lambda x: True if x['metadata'].get('tags') and 'parameters' in x['metadata'].get('tags') else False))
    
    report_assets = pipeline_path + "/" 'assets'
    if os.path.exists(report_assets):
        shutil.copytree(src=report_assets, dst="{}/assets".format(results))

    try:
        final_nb = pm.execute.execute_notebook(book, out_nb, parameters=parameters, cwd=results, progress_bar=False)
        html_exporter = HTMLExporter(template_file=str(TEMPLATE_PATH))
        html_exporter.__dict__['_trait_values'].update(REPORT_CONFIG)

        (body, resources) = html_exporter.from_notebook_node(
            final_nb, {"metadata": {"name": f"{metadata.pipeline_id.capitalize()} Report"}}
        )

        with open(f'{results}/report.html', "w") as o:
            o.write(body)
    except Exception as e:
        print(e)