from typing import List
from app.models.workflows import WorkflowSchema
from app.services.storages import StorageManager
from app.core.config.settings import settings
from app.models.stores import BaseStores

class NextflowConfigGenerator:
    def __init__(self, workflow: WorkflowSchema):
        self.workflow = workflow
        self.storage = StorageManager()

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
            self.storage.write(BaseStores.CACHE,config_file_name, config_content)
            config_path = self.storage.get_path(BaseStores.CACHE,config_file_name)
            command_parts.extend(["-c", config_path])
        
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
            config_generator = config_generators[config_type](self.workflow)
            command_parts.extend(config_generator.generate_command_parts())
        
        return " ".join(command_parts)