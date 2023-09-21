from pydantic import BaseModel
from typing import List, Dict
from app.models.enums import JobStatus
from app.models.pipelines.inputs import InputSchema


class Metadata(BaseModel):
    """
    Metadata model for rapid tracking of submissions
    """

    id: str
    name: str
    inputs: List[InputSchema]
    store: Dict[str, str]
    status: JobStatus
    processes: Dict[str, str] = None
    pipeline: str
