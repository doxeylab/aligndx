from app.core.config.settings import settings
from app.services import containers

class Nextflow():
    def __init__(self, meta, name, inputs, store):
        self.image = "nextflow/nextflow:latest"
        self.environment = {"NXF_HOME": f"{settings.DATA_FOLDER}/tools/nxf"}
        self.create_command(meta, name, inputs, store)

    def create_command(self, meta, name, inputs, store):
        parameters = ""
        # get user defined inputs
        for inp in inputs:
            if inp.input_type == 'file':
                parameter = f"--{inp.id} {store[inp.id]} "
            if inp.input_type == 'predefined':
                continue
            if inp.input_type == 'select' or inp.input_type == 'text': 
                value = " ".join(inp.values)
                parameter = f"--{inp.id} {value} "
            parameters = parameters + parameter

        # get system defined inputs
        pdc = meta.get('predefined_commands')
        if pdc:
            for c in pdc:
                parameters = parameters + " " + c

        self.command = f"nextflow -log {store['results']}/.nextflow.log run {meta['repository']} -latest -name {name} -profile docker -w {store['temp']} {parameters} --outdir {store['results']} ; nextflow clean {name}"

class Config():
    def __init__(self, meta, name, inputs, store):
        self.meta = meta
        self.name = name
        self.store = store
        self.inputs = inputs
        self.classes = {
            "nextflow": Nextflow
        }
        self.configure(self.meta, self.name, self.inputs, self.store)

    def configure(self, meta, name, inputs, store):
        pipeline_type = meta['pipeline_type']
        class_configs = self.classes[pipeline_type](
            meta=meta,
            name=name,
            inputs=inputs,
            store=store,
        )
        self.__dict__.update(vars(class_configs))
        self.container = self.create_container(self.image, self.environment, self.command)
    
    def create_container(self, image, environment, command):
        return containers.create(
            image=image, 
            command=command, 
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
                f"{settings.DATA_FOLDER}:{settings.DATA_FOLDER}"
            ],
            environment=environment,
            working_dir=f'{settings.DATA_FOLDER}'
            )