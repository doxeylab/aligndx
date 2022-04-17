from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models.schemas.base_schema import BaseSchema

class Customer(BaseSchema):
    id: UUID
    name: str
    email: str
    payment_card_type: str = None
    card_last4: str = None
    card_expiry: str = None

class CustomerNonAdmin(BaseSchema):
    id: UUID
    name: str
    email: str

class Subscription(BaseSchema):
    id: UUID
    is_active: bool
    is_cancelled: Optional[bool]
    cancel_date: Optional[datetime]
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
    payment_card_last4: str
    stripe_payment_receipt_url: str

class User(BaseSchema):
    id: UUID
    name: str
    email: str
    is_admin: bool

class AdminSettingsPageResponse(BaseSchema):
    current_user: User
    customer: Customer = None
    subscription: Subscription = None
    current_plan: Plan = None
    scheduled_plan: Optional[Plan] = None
    available_plans: List[Plan] = None
    invoices: List[Invoice] = None
    users: List[User]

class NonAdminSettingsPageResponse(BaseSchema):
    current_user: User
    customer: CustomerNonAdmin = None
    subscription: Subscription = None
