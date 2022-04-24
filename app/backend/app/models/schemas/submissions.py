from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema


class SubmissionBase(BaseSchema):
    name : str
    panel : str
    file_size: float
    result : dict = None 
    submission_type : str
    user_id : UUID
    created_date : datetime
    finished_date : datetime = None

class SubmissionSchema(SubmissionBase):
    id: UUID

class UpdateSubmissionResult(BaseSchema):
    result: dict

class UpdateSubmissionDate(BaseSchema):
    finished_date: datetime