from typing import List
from app.models.workflows import WorkflowSchema
from app.core.config.settings import settings

class NextflowConfigGenerator:
    def __init__(self, workflow: WorkflowSchema, user_inputs: dict):
        self.workflow = workflow
        self.user_inputs = user_inputs

    def generate_config(self, access_key: str, secret_key: str, endpoint: str):
        config = f"""
        docker {{
            enabled = true
        }}

        aws {{
            accessKey = {access_key}
            secretKey = {secret_key}
            client {{
                endpoint = {endpoint}
                protocol = 'http'
            }}
        }}
        """
        return config


    def generate_command_parts(self):
        command_parts = [
            "--max_cpus 2",
            "--max_memory 8.GB",
            "--max_time 1.h"
        ]

        config_content = self.generate_config(access_key=settings.STORAGE_ACCESS_KEY_ID, secret_key=settings.STORAGE_SECRET_ACCESS_KEY, endpoint=settings.STORAGE_ENDPOINT_URL)
        if config_content:
            config_file_name = "nextflow.config"
            with open(config_file_name, "w") as config_file:
                config_file.write(config_content)
            command_parts.extend(["-c", config_file_name])
        
        return command_parts


class ConfigGenerator:
    def __init__(self, workflow: WorkflowSchema, command_parts: List[str]):
        self.workflow = workflow
        self.command_parts = command_parts
        self.configured_command = self.generate_configured_command(self.command_parts)
    
    def generate_configured_command(self, command_parts):
        config_generators = {
            "nextflow": NextflowConfigGenerator
        }
        
        config_type = self.workflow.config.type.lower()
        if config_type in config_generators:
            config_generator = config_generators[config_type](self.workflow, self.user_inputs)
            command_parts.extend(config_generator.generate_command_parts())
        
        return " ".join(command_parts)