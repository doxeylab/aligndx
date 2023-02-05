from uuid import UUID
from datetime import datetime

from .base_schema import BaseSchema


class Base(BaseSchema):
    user_id : UUID
    created_date : datetime
    pipeline : str 
    items: list
    status: str
    # size : float 
    name : str = None
    finished_date : datetime = None

class Schema(Base):
    id: UUID

class UpdateDateAndStatus(BaseSchema):
    finished_date: datetime
    status: str

class UpdateStatus(BaseSchema):
    status: str
class Response(BaseSchema):
    created_date : datetime
    pipeline : str 
    items: list
    status: str 
    # size : float 
    name : str = None
    finished_date : datetime = None
    id: UUID