import re
from jsonschema import ValidationError
from app.services.storages import StorageManager
from app.models.stores import BaseStores
from app.models.workflows import ParamTypes, WorkflowSchema


def sanitize_text_input(text):
    # Only allow alphanumeric and some safe special characters like -_.
    return re.sub(r"[^a-zA-Z0-9\-_.]", "", text)


setattr(
    ParamTypes,
    "has_value",
    classmethod(lambda cls, value: any(value == item.value for item in cls)),
)


class CommandGenerator:
    def __init__(self, workflow: dict, submission_id: str):
        try:
            WorkflowSchema.parse_obj(workflow)
        except ValidationError as e:
            raise ValueError(f"Invalid Workflow JSON: {e.message}")

        self.metadata = workflow.get("metadata", {})
        self.config = workflow.get("config", {})
        self.params = workflow.get("params", [])
        self.storage = StorageManager(submission_id)

    def generate_command_part(self, param, param_value, command_flag):
        if param == ParamTypes.SELECT and isinstance(param_value, list):
            return [command_flag, ",".join(param_value)]
        if param in {ParamTypes.FILE, ParamTypes.URL} and isinstance(param_value, list):
            path = self.storage.get_path(
                store=BaseStores.SUBMISSIONS, filename=param_value
            )
            return [command_flag, " ".join(path)]
        if param == ParamTypes.TEXT:
            return [command_flag, sanitize_text_input(param_value)]
        if param == ParamTypes.NUMBER:
            return [command_flag, str(param_value)]
        if param == ParamTypes.BOOLEAN and param_value:
            return [command_flag]
        if param == ParamTypes.OUTPUT:
            path = self.storage.get_path(store=BaseStores.RESULTS, filename=param_value)
            return [command_flag, " ".join(path)]
        return []

    def generate_command(self, user_inputs: dict):
        command_parts = [
            self.config.get("launch_command", "").replace("{{params}}", "")
        ]
        missing_required_params = []

        for param in self.params:
            param_id = param.get("id", "")
            command_flag = param.get("flag", f"--{param_id}")
            param_type_str = param.get("type", "")
            is_required = param.get("required", False)
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
