import email
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.models.schemas.base_schema import BaseSchema

class Customer(BaseSchema):
    id: UUID
    name: str
    email: str
    payment_card_type: str
    card_last4: str
    card_expiry: str

class Subscription(BaseSchema):
    id: UUID
    is_active: bool
    is_cancelled: bool
    cancel_date: datetime
    current_period_start: datetime
    current_period_end: datetime
    is_paid: bool
    auto_renew: bool
    plan_id: UUID
    scheduled_plan_id: Optional[UUID]

class Plan(BaseSchema):
    id: UUID
    name : str
    description : str
    base_price : int
    tax_amount : int
    total_price : int
    tax_rate: int
    data_limit_mb: float

class Invoice(BaseSchema):
    id: UUID
    invoice_date: datetime
    amount_paid: int
    stripe_invoice_number: str
    payment_card_type: str
    card_last4: str
    stripe_payment_receipt_url: str

class User(BaseSchema):
    id: UUID
    name: str
    email: str
    is_admin: bool

class SettingsPageResponse(BaseSchema):
    customer: Customer
    subscription: Subscription
    current_plan: Plan
    scheduled_plan: Optional[UUID]
    available_plans: List[Plan]
    invoices: List[Invoice]
    users: List[User]