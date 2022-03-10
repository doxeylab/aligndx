from uuid import UUID
from datetime import datetime

from app.models.schemas import BaseSchema


class SubmissionBase(BaseSchema):
    sample_name : str
    panel : str
    result : dict
    submission_type : str
    user_id : UUID
    created_date : datetime
    finished_date : datetime = None

class InSubmissionSchema(SubmissionBase):
    # can add validation logic here, if need be
    ...

class SubmissionSchema(SubmissionBase):
    id: UUID
 