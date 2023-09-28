from app.services.storages import StorageManager
from app.models.stores import BaseStores
from app.models.workflows import Param, ParamTypes, ParamValue, WorkflowSchema
from app.services.workflows.configs import ConfigGenerator
import re
import urllib.parse
from typing import List

def sanitize_text_input(text):
    # Only allow alphanumeric and some safe special characters like -_.
    return re.sub(r"[^a-zA-Z0-9\-_.]", "", text)

class CommandGenerator:
    """
    Generates the workflow command depending on the user inputs. Note that file data is assumed to be handled by the api routers, and is accessible via the storagemanager.
    """
    def __init__(self, workflow: WorkflowSchema, submission_id: str):
        self.validate_workflow(workflow)
        self.workflow = workflow
        self.storage = StorageManager(submission_id)

    @staticmethod
    def validate_workflow(workflow: WorkflowSchema):
        if not workflow:
            raise ValueError("Invalid Workflow JSON")

    def handle_file_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        if type(param_value) == str:
            path = self.storage.get_path(store=BaseStores.SUBMISSIONS, filename=param_value)
            return [command_flag, " ".join(path)]
        
        if type(param_value) == list:
            path = self.storage.get_path(store=BaseStores.SUBMISSIONS, filename=param_value, prefix_path=True)
            return [command_flag, " ".join(path)]
        
        if param_value is None and param.default:
            parsed_url = urllib.parse.urlparse(param.default)
            if not (parsed_url.scheme and parsed_url.netloc):
                return [command_flag, " ".join(param.default)]
            key = urllib.parse.unquote(parsed_url.path.split("/")[-1])

            path = (
                self.storage.get_cache_path(
                    store=BaseStores.CACHE,
                    url=param.default,
                    key=key,
                ),
            )
            return [command_flag, " ".join(path)]
        
        else:
            # No passed param
            return []

    def handle_select_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        if type(param_value) == str:
            return [command_flag, " ".join(param_value)]
        
        if type(param_value) == list:
            return [command_flag, ",".join(param_value)]
        
        if param_value is None and param.default:
            return [command_flag, " ".join(param.default)]
        
        else:
            # No passed param
            return []



    def handle_number_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        if type(param_value) == int or type(param_value) == float :
            return [command_flag, " ".join(param_value)]
        
        if type(param_value) == list:
            return [command_flag, ",".join(param_value)]
        
        if param_value is None and param.default:
            return [command_flag, " ".join(param.default)]
        
        else:
            # No passed param
            return []


    def handle_boolean_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        if not param_value and param.default:
            return [command_flag]
        if param_value:
            return [command_flag]
        else:
            return []
        
    def handle_text_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        if param_value is None and param.default:
            return [command_flag, " ".join(param.default)]
        if param_value:
            return [command_flag, " ".join(param_value)]
        else:
            return []
        

    def handle_output_type(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        # TODO fix this get_path functionality. Passing the filename should not be allowed if return a prefix-path
        path = self.storage.get_path(
                store=BaseStores.RESULTS, filename=param_value, prefix_path=True
            )
        return [command_flag, " ".join(path)]

    
    def generate_command_part(self, param: Param, param_value: ParamValue, command_flag: str) -> List[str]:
        handlers = {
            ParamTypes.FILE: self.handle_file_type,
            ParamTypes.SELECT: self.handle_select_type,
            ParamTypes.NUMBER: self.handle_number_type,
            ParamTypes.BOOLEAN: self.handle_boolean_type,
            ParamTypes.TEXT: self.handle_text_type,
            ParamTypes.OUTPUT: self.handle_output_type,
        }
        
        handler = handlers.get(param.type)
        if handler:
            return handler(param, param_value, command_flag)
        return []

    def generate_command(self, user_inputs: dict) -> str:
        command_parts = [self.workflow.config.launch_command.replace("{{params}}", "")]
        missing_required_params = []

        for param in self.workflow.params:
            command_flag = param.flag or f"--{param.id}"
            param_value = user_inputs.get(param.id, "")
            
            if param.required and not param_value and not param.default and param.type != ParamTypes.OUTPUT:
                missing_required_params.append(param.id)
                continue

            if param.report_only:
                continue

            command_parts.extend(
                self.generate_command_part(param, param_value, command_flag)
            )

        config_generator = ConfigGenerator(self.workflow, command_parts)
        configured_command_parts = config_generator.configured_command

        if missing_required_params:
            raise ValueError(f"Missing required parameters: {', '.join(missing_required_params)}")

        return " ".join(configured_command_parts)
