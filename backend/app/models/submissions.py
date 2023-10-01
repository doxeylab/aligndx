from pydantic import Field
from uuid import UUID
from datetime import datetime
from app.models.base_schema import BaseSchema
from app.models.status import SubmissionStatus
from typing import Any, Dict

class Base(BaseSchema):
    """
    Base submissions model
    """
    name : str = Field(description='A name for the submission')
    pipeline : str 
    inputs: Dict[str, Any]

class Request(Base):
    """
    Request Model
    """
    pass

class Run(BaseSchema):
    """
    Request Model
    """
    sub_id : str


class Entry(Base):
    """
    Submission DB entry Model
    id is defaulted to none as it will be created automatically
    """
    id: UUID = None
    user_id : UUID
    status: SubmissionStatus
    created_date : datetime
    finished_date : datetime = None

class Response(Base):
    """
    Response Model
    """
    id: UUID
    status: SubmissionStatus
    created_date : datetime
    finished_date : datetime = None

class UpdateDateAndStatus(BaseSchema):
    finished_date: datetime
    status: str

class UpdateStatus(BaseSchema):
    status: str