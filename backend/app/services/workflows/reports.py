import subprocess, os, shutil
from datetime import date
from pathlib import Path
import nbformat as nbf
from nbconvert import HTMLExporter
import papermill as pm

TEMPLATE_PATH = Path(__file__).parent / "template.html"

REPORT_CONFIG = {
    "exclude_input": True,
    "exclude_output_prompt": True,
    "exclude_input_prompt": True,
}


class ReportGenerator:
    def __init__(self, logs_path, metadata, schema, pipeline_path):
        self.logs_path = logs_path
        self.metadata = metadata
        self.schema = schema
        self.pipeline_path = pipeline_path

    def get_errors(self, pattern):
        errors = subprocess.run(
            ["sed", "-n", pattern, self.logs_path], capture_output=True
        )
        return errors.stdout.decode("utf-8")

    def create_metadata_layout(self, error):
        return f"""
        # Metadata

        ```
        Run : {self.metadata.name} 
        Status: {self.metadata.status}
        Created: {date.today()}
        ```
        {error}
        """

    def create_notebooks(self, metadata_layout):
        meta_nb = nbf.v4.new_notebook()
        code = """
        import pandas as pd 
        pd.set_option('display.max_rows', None, 'display.max_columns', None)
        """
        meta_nb["cells"] = [
            nbf.v4.new_markdown_cell(metadata_layout),
            nbf.v4.new_code_cell(code),
        ]

        pipeline_nb_path = Path(self.pipeline_path) / "report.ipynb"
        pipeline_nb = nbf.read(pipeline_nb_path, as_version=4)

        return meta_nb, pipeline_nb

    @staticmethod
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

    def create_parameters(inputs, pipeline_schema):
        report_inputs = pipeline_schema.get("report_inputs")
        if report_inputs:
            parameters = {**inputs, **report_inputs}
        else:
            parameters = {**inputs}

        return parameters

    def draft_report(self):
        pattern = "/Caused by:/,${p;/Command executed/q}"
        error = ""
        if pattern and self.metadata.status == "error":
            error = self.get_errors(pattern=pattern)

        metadata_layout = self.create_metadata_layout(error)
        meta_nb, pipeline_nb = self.create_notebooks(metadata_layout)
        book = self.book_combiner([meta_nb, pipeline_nb])

        results = self.metadata.store["results"]
        inputs = {
            inp.id: inp.values
            for inp in self.metadata.inputs
            if inp.input_type != "output"
        }
        parameters = self.create_parameters(inputs, self.schema)

        report_assets = self.pipeline_path + "/" "assets"
        if os.path.exists(report_assets):
            shutil.copytree(src=report_assets, dst="{}/assets".format(results))

        out_nb = self.metadata.store["results"] + "/report.ipynb"
        try:
            final_nb = pm.execute.execute_notebook(
                book, out_nb, parameters=parameters, cwd=results, progress_bar=False
            )
            html_exporter = HTMLExporter(template_file=str(TEMPLATE_PATH))
            html_exporter.__dict__["_trait_values"].update(REPORT_CONFIG)

            (body, resources) = html_exporter.from_notebook_node(
                final_nb,
                {"metadata": {"name": f"{self.metadata.pipeline.capitalize()} Report"}},
            )

            with open(f"{results}/report.html", "w") as o:
                o.write(body)
        except Exception as e:
            print(e)
