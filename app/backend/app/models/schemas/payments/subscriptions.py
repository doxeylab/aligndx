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
    is_cancelled : bool = None
    cancel_date : datetime = None
    current_period_start : datetime = None
    current_period_end : datetime = None
    stripe_customer_id : str
    stripe_latest_invoice_id : str = None
    stripe_subscription_id : str
    stripe_price_id : str
    stripe_default_payment_method_id : str = None
    payment_card_type : str = None
    card_last4 : str = None
    card_expiry : str = None
 
class SubscriptionSchema(SubscriptionBase):
    id: UUID

class CreateSubscriptionRequest(BaseSchema):
    stripe_price_id: str

class CreateNewSubscription(BaseSchema):
    is_active : bool
    status : str
    is_paid : bool
    plan_description : str
    stripe_price_id : str
    customer_id : UUID
    stripe_customer_id : str
    creation_time : datetime

class UpdateInitialSubscription(BaseSchema):
    stripe_subscription_id : str
    initial_start_date : datetime

class UpdateItemsAfterPaymentSuccess(BaseSchema):
    is_active : bool
    status : str
    is_paid : bool
    stripe_latest_invoice_id : str
    current_period_start : datetime
    current_period_end : datetime