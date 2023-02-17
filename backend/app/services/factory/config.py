from app.core.config.settings import settings
import docker
client = docker.from_env()

class Config():
    def __init__(self, schema, inputs, store):
        self.schema = schema
        self.inputs = inputs
        self.store = store 
        self.container = self.create()
    
    def create_command(self,schema, inputs, store):
        parameters = ""
        for inp in inputs:
            if inp.input_type == 'file':
                parameter = f"--{inp.id} {store[inp.id]}"

            elif inp.input_type == 'predefined':
                continue

            elif inp.input_type == 'select' or inp.input_type == 'text': 
                value = " ".join(inp.values)
                parameter = f"--{inp.id} {value}"

            elif inp.input_type == 'output':
                output_path = store.get("results")
                parameter = f"--{inp.id} {output_path}"

            parameters = parameters + parameter + " "
        
        pdc = schema.get('predefined_commands')
        if pdc:
            for c in pdc:
                parameters = parameters + " " + c

        return "{launch} {parameters}".format(
            launch=schema.get("launch"),
            parameters=parameters
        )

    def create(self):
        container = client.containers.create(
            image=self.schema.get("image"),
            command=self.create_command(schema=self.schema, inputs=self.inputs, store=self.store),
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
                f"{settings.DATA_FOLDER}:{settings.DATA_FOLDER}"
            ],
            environment={"NXF_HOME": settings.DATA_FOLDER + "/tools/",
                         "NXF_WORK": self.store['temp']},
            working_dir=settings.DATA_FOLDER
        )
        return container