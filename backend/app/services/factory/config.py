from app.core.config.settings import settings
import docker
client = docker.from_env()

def handle_file_input(inp, store):
    return f"--{inp.id} {store[inp.id]}"

def handle_select_or_text_input(inp):
    value = " ".join(inp.values)
    return f"--{inp.id} {value}"

def handle_output_input(inp, store):
    output_path = store.get("results")
    return f"--{inp.id} {output_path}"

INPUT_TYPE_TO_HANDLER = {
    'file': handle_file_input,
    'select': handle_select_or_text_input,
    'text': handle_select_or_text_input,
    'output': handle_output_input,
    'predefined': lambda inp, store: ""
}

class Config:
    def __init__(self, schema, inputs, store):
        self.schema = schema
        self.inputs = inputs
        self.store = store 
        self.container = self.create()

    def create_command(self):
        parameters = " ".join(
            INPUT_TYPE_TO_HANDLER[inp.input_type](inp, self.store) 
            for inp in self.inputs
        )

        pdc = self.schema.get('predefined_commands', [])
        additional_commands = " ".join(pdc)
        
        return f"{self.schema.get('launch')} {parameters} {additional_commands}"

    def create(self):
        container = client.containers.create(
            image=self.schema.get("image"),
            command=self.create_command(),
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
                f"{settings.DATA_FOLDER}:{settings.DATA_FOLDER}"
            ],
            environment={
                "NXF_HOME": f"{settings.DATA_FOLDER}/tools/",
                "NXF_WORK": self.store['temp']
            },
            working_dir=settings.DATA_FOLDER
        )
        return container
