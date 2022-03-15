from uuid import UUID
from datetime import datetime

from app.models.schemas import BaseSchema


class SubmissionBase(BaseSchema):
    sample_name : str
    panel : str
    result : dict = None 
    submission_type : str
    user_id : UUID
    created_date : datetime
    finished_date : datetime = None

class SubmissionSchema(SubmissionBase):
    id: UUID

class UpdateSubmissionResult(BaseSchema):
    data: dict

class UpdateSubmissionDate(BaseSchema):
    finished_date: datetime