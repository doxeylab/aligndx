from app.core.config.settings import settings
from app.models.stores import BaseStores
import docker
client = docker.from_env()

class Config():
    def __init__(self, schema, inputs, storage):
        self.schema = schema
        self.inputs = inputs
        self.storage = storage
        self.container = self.create()

    def create_command(self, schema, inputs):
        parameters = ""
        schema_inputs = schema.get("inputs")
        # Adjust the schema looping since schema is a list
        for inp in schema_inputs: 
            parameter = ""
            inp_type = inp['input_type']
            inp_id = inp['id']

            if inp_type == 'file':
                filename = inputs.get(inp_id, 'dummy')[0] if inputs.get(inp_id) else 'dummy'
                parameter = f"--{inp_id} {self.storage.get_path(store=BaseStores.SUBMISSION_DATA, filename=filename, prefix_path=True)}"

            elif inp_type == 'predefined':
                continue

            elif inp_type == 'select' or inp_type == 'text': 
                user_input = inputs.get(inp_id, [])
                value = ""
                if type(user_input) == list:
                    value = " ".join(user_input)
                else:
                    value = user_input
                parameter = f"--{inp_id} {value}"

            elif inp_type == 'output':
                output_path = self.storage.get_path(store=BaseStores.RESULTS, filename='dummy', prefix_path=True)
                parameter = f"--{inp_id} {output_path}"

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
        image = self.schema.get("image")
        client.images.pull(image)
        container = client.containers.create(
            image=image,
            command=self.create_command(schema=self.schema, inputs=self.inputs),
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
                f"{settings.DATA_FOLDER}:{settings.DATA_FOLDER}"
            ],
            environment={"NXF_HOME": settings.DATA_FOLDER + "/tools/",
                         "NXF_WORK": self.storage.get_path(BaseStores.TEMP, filename='dummy', prefix_path=True)},
            working_dir=settings.DATA_FOLDER
        )
        return container