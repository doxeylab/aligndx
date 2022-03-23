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
    stripe_default_payment_method_id : str = None
    payment_card_type : str = None
    card_last4 : str = None
    card_expiry : str = None

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

class UpdatePaymentMethod(BaseSchema):
    stripe_default_payment_method_id: str
    payment_card_type: str
    card_last4: str
    card_expiry: str