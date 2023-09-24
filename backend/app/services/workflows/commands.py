from enum import Enum
import re, os, json
from jsonschema import validate, ValidationError


def sanitize_text_input(text):
    # Only allow alphanumeric and some safe special characters like -_.
    return re.sub(r"[^a-zA-Z0-9\-_.]", "", text)


class ParamType(Enum):
    SELECT = "select"
    FILE = "file"
    URL = "url"
    NUMBER = "number"
    BOOLEAN = "boolean"
    TEXT = "text"
    OUTPUT = "output"


class CommandGenerator:
    def __init__(self, workflow):
        schema_file_path = os.path.join(os.path.dirname(__file__), "schema.json")

        with open(schema_file_path, "r") as f:
            schema = json.load(f)

        try:
            validate(instance=workflow, schema=schema)
        except ValidationError as e:
            raise ValueError(f"Invalid Workflow JSON: {e.message}")

        self.metadata = workflow.get("metadata", {})
        self.config = workflow.get("config", {})
        self.params = workflow.get("params", [])

    def generate_command_part(self, param, param_value, command_flag):
        if param == ParamType.SELECT and isinstance(param_value, list):
            return [command_flag, ",".join(param_value)]
        if param in {ParamType.FILE, ParamType.URL} and isinstance(param_value, list):
            return [command_flag, " ".join(param_value)]
        if param == ParamType.TEXT:
            return [command_flag, sanitize_text_input(param_value)]
        if param == ParamType.NUMBER:
            return [command_flag, str(param_value)]
        if param == ParamType.BOOLEAN and param_value:
            return [command_flag]
        if param == ParamType.OUTPUT:
            return [command_flag, param_value]
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

            if not param_id or not ParamType.has_value(param_type_str):
                continue

            if is_required and not param_value:
                missing_required_params.append(param_id)
                continue

            param_type = ParamType(param_type_str)
            command_parts.extend(
                self.generate_command_part(param_type, param_value, command_flag)
            )

        if missing_required_params:
            raise ValueError(
                f"Missing required parameters: {', '.join(missing_required_params)}"
            )

        return " ".join(command_parts)


setattr(
    ParamType,
    "has_value",
    classmethod(lambda cls, value: any(value == item.value for item in cls)),
)
