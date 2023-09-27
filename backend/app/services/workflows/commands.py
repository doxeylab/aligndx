import re
from jsonschema import ValidationError
from app.services.storages import StorageManager
from app.models.stores import BaseStores
from app.models.workflows import ParamTypes, WorkflowSchema
import urllib.parse


def sanitize_text_input(text):
    # Only allow alphanumeric and some safe special characters like -_.
    return re.sub(r"[^a-zA-Z0-9\-_.]", "", text)


setattr(
    ParamTypes,
    "has_value",
    classmethod(lambda cls, value: any(value == item.value for item in cls)),
)


class CommandGenerator:
    def __init__(self, workflow: WorkflowSchema, submission_id: str):
        self.validate_workflow(workflow)
        self.metadata = workflow.metadata
        self.config = workflow.config
        self.params = workflow.params
        self.storage = StorageManager(submission_id)

    @staticmethod
    def validate_workflow(workflow: WorkflowSchema):
        if not workflow:
            raise ValueError("Invalid Workflow JSON")

    def generate_command_part(self, param, param_value, command_flag):
        if param.type == ParamTypes.FILE and param_value is None and param.default:
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

        if param.type == ParamTypes.SELECT and isinstance(param_value, list):
            return [command_flag, ",".join(param_value)]

        if param.type in {ParamTypes.FILE, ParamTypes.URL} and isinstance(
            param_value, list
        ):
            path = self.storage.get_path(
                store=BaseStores.SUBMISSIONS,
                filename=param_value[0] if param_value else "",
            )
            return [command_flag, " ".join(path)]

        if param.type == ParamTypes.TEXT:
            return [command_flag, sanitize_text_input(param_value)]

        if param.type == ParamTypes.NUMBER:
            return [command_flag, str(param_value)]

        if param.type == ParamTypes.BOOLEAN and param_value:
            return [command_flag]

        if param.type == ParamTypes.OUTPUT:
            path = self.storage.get_path(store=BaseStores.RESULTS, filename=param_value)
            return [command_flag, " ".join(path)]

        return []

    def generate_command(self, user_inputs: dict):
        command_parts = [self.config.launch_command.replace("{{params}}", "")]
        missing_required_params = []

        for param in self.params:
            param_id = param.id
            command_flag = param.flag if param.flag else f"--{param_id}"
            param_type_str = param.type
            is_required = param.required
            param_value = user_inputs.get(param_id, "")

            if not param_id or not ParamTypes.has_value(param_type_str):
                continue

            if is_required and not param_value:
                missing_required_params.append(param_id)
                continue

            param_type = ParamTypes(param_type_str)
            command_parts.extend(
                self.generate_command_part(param_type, param_value, command_flag)
            )

        if missing_required_params:
            raise ValueError(
                f"Missing required parameters: {', '.join(missing_required_params)}"
            )

        return " ".join(command_parts)
