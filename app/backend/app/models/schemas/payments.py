from uuid import UUID
from datetime import datetime

from app.models.schemas import BaseSchema

#  -- Customers Schema -- 

class CustomerBase(BaseSchema):
    admin_user_id : UUID
    name : str
    email : str
    creation_time : str
    stripe_customer_id : str

class InCustomerSchema(CustomerBase):
    # can add validation logic here, if need be
    ...

class CustomerSchema(CustomerBase):
    id: UUID

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

class InSubscriptionSchema(SubscriptionBase):
    # can add validation logic here, if need be
    ...

class SubscriptionSchema(SubscriptionBase):
    id: UUID

#  -- Invoices Schema -- 

class InvoiceBase(BaseSchema):
    subscription_id : UUID
    customer_id : UUID
    creation_time : datetime
    status : str
    amount_due : int
    amount_paid : int
    currency : str
    payment_card_type : str
    payment_card_last4 : str
    payment_card_expiry : str
    invoice_date : datetime
    billing_period_start : datetime
    billing_period_end : datetime
    stripe_invoice_id : str
    stripe_payment_intent_id : str
    stripe_payment_method_id : str
    stripe_invoice_url : str
    stripe_invoice_number : str
    stripe_payment_receipt_url : str

class InInvoiceSchema(InvoiceBase):
    # can add validation logic here, if need be
    ...

class InvoiceSchema(InvoiceBase):
    id: UUID