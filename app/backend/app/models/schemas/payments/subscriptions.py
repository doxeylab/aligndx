from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema

#  -- Subscriptions Schema -- 

class SubscriptionBase(BaseSchema):
    customer_id : UUID
    creation_time : datetime
    is_active : bool
    status : str
    plan_description : str
    initial_start_date : datetime
    is_cancelled : bool
    cancel_date : datetime
    current_period_start : datetime
    current_period_end : datetime
    stripe_customer_id : str
    stripe_latest_invoice_id : str
    stripe_subscription_id : str
    stripe_price_id : str
    stripe_default_payment_method_id : str
    payment_card_type : str
    card_last4 : str
    card_expiry : str
 
class SubscriptionSchema(SubscriptionBase):
    id: UUID

class CreateSubscriptionRequest(BaseSchema):
    stripe_price_id: str

class NewSubscription(BaseSchema):
    is_active : bool
    status : str
    plan_description : str
    stripe_price_id : str
    customer_id : UUID
    stripe_customer_id : str
    creation_time : datetime

class UpdateSubscription(BaseSchema):
    stripe_subscription_id : str
    stripe_latest_invoice_id : str
    status : str
    initial_start_date : datetime
    current_period_start : datetime
    current_period_end : datetime