from pydantic import Field
from typing import List
from uuid import UUID
from datetime import datetime
from app.models.base_schema import BaseSchema
from app.models.pipelines.inputs import InputSchema
from app.models.shared import status

class Base(BaseSchema):
    """
    Base submissions model
    """
    name : str = Field(description='A name for the submission')
    pipeline : str 
    inputs: List[InputSchema]

class Request(Base):
    """
    Request Model
    """
    pass

class Entry(Base):
    """
    Submission DB entry Model
    id is defaulted to none as it will be created automatically
    """
    id: UUID = None
    user_id : UUID
    status: status
    created_date : datetime
    finished_date : datetime = None

class Response(Base):
    """
    Response Model
    """
    id: UUID
    status: status
    created_date : datetime
    finished_date : datetime = None