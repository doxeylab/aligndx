from typing import List
from uuid import UUID
from datetime import datetime
from ..base_schema import BaseSchema 

#  -- Plans Schema -- 

class PlanBase(BaseSchema):
    name : str
    description : str
    base_price : int
    tax_amount : int
    total_price : int
    tax_rate: int
    data_limit_mb: float
    stripe_price_id: str
    creation_time: datetime
    is_archived: bool
    archived_time: datetime

class PlanSchema(PlanBase):
    id: UUID

class PlanResponse(BaseSchema):
    id: UUID
    name : str
    description : str
    base_price : int
    tax_amount : int
    total_price : int
    tax_rate: int
    data_limit_mb: float

class AllPlansResponse(BaseSchema):
    plans: List[PlanResponse]