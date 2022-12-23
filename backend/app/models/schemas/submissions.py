from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema


class SubmissionBase(BaseSchema):
    user_id : UUID
    created_date : datetime
    pipeline : str 
    items: list
    # size : float 
    name : str = None
    finished_date : datetime = None

class SubmissionSchema(SubmissionBase):
    id: UUID

class UpdateSubmissionDate(BaseSchema):
    finished_date: datetime
 