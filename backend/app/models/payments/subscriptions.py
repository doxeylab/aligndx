from uuid import UUID
from datetime import datetime
from typing import Optional
from ..base_schema import BaseSchema

#  -- Subscriptions Schema -- 

class SubscriptionBase(BaseSchema):
    customer_id: UUID
    plan_id: UUID
    creation_time: datetime
    is_active: bool
    status: str
    initial_start_date: datetime
    is_cancelled: bool
    cancel_date: datetime
    current_period_start: datetime
    current_period_end: datetime
    stripe_latest_invoice_id: str
    stripe_subscription_id: str
    is_paid: bool
    auto_renew: bool
    allow_downgrade: bool
 
class SubscriptionSchema(SubscriptionBase):
    id: UUID

class SubscriptionDTO(BaseSchema):
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
    data_used: float
    data_limit_mb: float

class CreateSubscriptionRequest(BaseSchema):
    plan_id: UUID

class ChangePlanRequest(BaseSchema):
    plan_id: UUID

class CreateNewSubscription(BaseSchema):
    customer_id: UUID
    plan_id: UUID
    is_active: bool
    status: str
    data_used: float
    data_limit_mb: float
    is_paid: bool
    auto_renew: bool
    allow_downgrade: bool
    creation_time: datetime

class UpdateInitialSubscription(BaseSchema):
    stripe_subscription_id : str
    initial_start_date : datetime

class UpgradeSubscription(BaseSchema):
    plan_id : UUID
    data_limit_mb: float

class DowngradeSubscription(BaseSchema):
    scheduled_plan_id: UUID
    stripe_schedule_id: str
    allow_downgrade: bool

class CancelDowngradeSubscription(BaseSchema):
    scheduled_plan_id: Optional[UUID]
    stripe_schedule_id: Optional[str]
    allow_downgrade: bool

class ProcessDowngradeSubscription(BaseSchema):
    scheduled_plan_id: Optional[UUID]
    stripe_schedule_id: Optional[str]
    allow_downgrade: bool
    plan_id: UUID
    data_used: float
    data_limit_mb: float

class UpdateItemsAfterPaymentSuccess(BaseSchema):
    is_active : bool
    status : str
    is_paid : bool
    stripe_latest_invoice_id : str
    current_period_start : datetime
    current_period_end : datetime
    auto_renew: bool
    allow_downgrade: bool
    data_used: float

class SetAutoRenew(BaseSchema):
    auto_renew: bool

class SubCancelResponse(BaseSchema):
    current_period_end: datetime

class UpdateItemsAfterCancel(BaseSchema):
    is_active: bool
    status: str
    is_paid: bool
    is_cancelled: bool
    cancel_date: datetime
    auto_renew: bool

class UpdateData(BaseSchema):
    data_used: float