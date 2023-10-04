from pydantic import BaseModel
from typing import Any, Dict
from app.models.status import SubmissionStatus

class MetaModel(BaseModel):
    """
    MetaModel descriptor for rapid tracking of submissions
    """
    id: str = None
    submission_id : str
    name: str
    inputs: Dict[str, Any]
    status: SubmissionStatus
    pipeline_id: str
    position : int = None


