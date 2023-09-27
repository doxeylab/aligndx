from typing import List, Optional, Union
from pydantic import BaseModel, constr, validator
from enum import Enum

ParamValue = Union[str, int, float, bool, List[str]]


class ParamTypes(str, Enum):
    SELECT = "select"
    FILE = "file"
    URL = "url"
    NUMBER = "number"
    BOOLEAN = "boolean"
    TEXT = "text"
    OUTPUT = "output"


class Range(BaseModel):
    min: float
    max: float


class Param(BaseModel):
    id: str
    title: str
    type: ParamTypes
    description: str
    multiple: Optional[bool] = False
    required: Optional[bool] = True
    options: Optional[List[str]]
    flag: Optional[constr(regex="--[a-zA-Z0-9]+")]
    accepted_formats: Optional[List[str]]
    range: Optional[Range]
    default: Optional[str] = None
    report_only: Optional[bool] = False

    @validator("range", pre=True, always=True)
    def check_range(cls, v, values):
        if values.get("type") != "number" and v is not None:
            raise ValueError("Range must not be provided for types other than 'number'")
        return v


class Config(BaseModel):
    type: str
    image: str
    launch_command: str


class Metadata(BaseModel):
    id: str
    title: str
    description: str
    tags: List[str]


class WorkflowSchema(BaseModel):
    metadata: Metadata
    config: Config
    params: List[Param]
