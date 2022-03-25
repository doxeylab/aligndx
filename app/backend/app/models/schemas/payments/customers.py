from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.schemas.base_schema import BaseSchema

#  -- Customers Schema -- 

class CustomerBase(BaseSchema):
    name: str
    email: str
    creation_time: str
    stripe_customer_id: str
    stripe_default_payment_method_id: Optional[str]
    payment_card_type: Optional[str]
    card_last4: Optional[str]
    card_expiry: Optional[str]
    customer_id: Optional[UUID]
    is_admin: bool

class CustomerSchema(CustomerBase):
    id: UUID

class CustomerDTO(BaseSchema):
    id: int
    name: str
    email: str
    stripe_customer_id: Optional[str]
    customer_id: Optional[UUID]
    is_admin: bool

class NewCustomer(BaseSchema):
    name : str
    email : str
    creation_time: datetime

class UpdateCustomerStripeId(BaseSchema):
    stripe_customer_id: str

class UpdatePaymentMethod(BaseSchema):
    stripe_default_payment_method_id: str = None
    payment_card_type: str = None
    card_last4: str = None
    card_expiry: str = None