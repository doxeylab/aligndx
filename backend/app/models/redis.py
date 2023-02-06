from pydantic import BaseModel
from typing import List, Dict
from app.models.shared import status
from app.models.pipelines.inputs import InputSchema

class MetaModel(BaseModel):
    """
    MetaModel descriptor for rapid tracking of submissions
    """
    name: str
    container_id: str
    inputs: List[InputSchema]
    store: Dict[str,str]
    status: status
    processes: Dict[str,str] = None


