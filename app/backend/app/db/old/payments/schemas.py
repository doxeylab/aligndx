from typing import Optional
from pydantic import BaseModel

from datetime import datetime

class CreateSubscriptionRequest(BaseModel):
    stripe_price_id: str

class CustomerDTO(BaseModel):
    id: int
    name: str
    email: str
    stripe_customer_id: str = None
