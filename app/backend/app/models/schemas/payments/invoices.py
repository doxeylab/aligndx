from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema

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

class InvoiceSchema(InvoiceBase):
    id: UUID

class CreateNewInvoice(BaseSchema):
    status: str
    amount_due: int
    amount_paid: int
    currency: str
    invoice_date: datetime
    billing_period_start: datetime
    billing_period_end: datetime
    stripe_invoice_id: str
    stripe_payment_intent_id: str
    stripe_invoice_url: str
    stripe_invoice_number: str
    subscription_id: UUID
    customer_id: UUID
    creation_time: datetime
    payment_card_type: str
    payment_card_last4: str
    payment_card_expiry: str
    stripe_payment_receipt_url: str
    stripe_payment_method_id: str

