from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema

#  -- Customers Schema -- 

class CustomerBase(BaseSchema):
    admin_user_id : UUID
    name : str
    email : str
    creation_time : str
    stripe_customer_id : str

class CustomerSchema(CustomerBase):
    id: UUID

class CustomerDTO(BaseSchema):
    id: int
    name: str
    email: str
    stripe_customer_id: str = None

class NewCustomer(BaseSchema):
    name : str
    email : str
    admin_user_id : UUID
    creation_time: datetime

class UpdateCustomerStripeId(BaseSchema):
    stripe_customer_id: str