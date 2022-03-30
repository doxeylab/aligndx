from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID

from app.db.tables.base import Base

class Customers(Base):
    __tablename__ = "customers"

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    creation_time = Column(DateTime, nullable=False)
    stripe_customer_id = Column(String, nullable=True)
    stripe_default_payment_method_id = Column(String(50), nullable=True)
    payment_card_type = Column(String(50), nullable=True)
    card_last4 = Column(String(50), nullable=True)
    card_expiry = Column(String(50), nullable=True)

class Subscriptions(Base):
    __tablename__ = "subscriptions"

    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"), nullable=False)
    creation_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, nullable=False)
    is_paid = Column(Boolean, nullable=False)
    status = Column(String(50), nullable=False)
    initial_start_date = Column(DateTime, nullable=True)
    is_cancelled = Column(Boolean, nullable=True)
    cancel_date = Column(DateTime, nullable=True)
    auto_renew = Column(Boolean, nullable=False)
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    stripe_latest_invoice_id = Column(String(50), nullable=True)
    stripe_subscription_id = Column(String(50), nullable=True)
    allow_downgrade = Column(Boolean, nullable=False)
    stripe_schedule_id = Column(String(50), nullable=True)
    scheduled_plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id"), nullable=True)

class Invoices(Base):
    __tablename__ = "invoices"

    subscription_id = Column(UUID(as_uuid=True), ForeignKey("subscriptions.id"), nullable=False)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False)
    creation_time = Column(DateTime, nullable=False)
    status = Column(String(50), nullable=False)
    amount_due = Column(Integer, nullable=False)
    amount_paid = Column(Integer, nullable=False)
    currency = Column(String(50), nullable=False)
    payment_card_type = Column(String(50), nullable=True)
    payment_card_last4 = Column(String(50), nullable=True)
    payment_card_expiry = Column(String(50), nullable=True)
    invoice_date = Column(DateTime, nullable=False)
    billing_period_start = Column(DateTime, nullable=False)
    billing_period_end = Column(DateTime, nullable=False)
    stripe_invoice_id = Column(String(50), nullable=False)
    stripe_payment_intent_id = Column(String(50), nullable=True)
    stripe_payment_method_id = Column(String(50), nullable=True)
    stripe_invoice_url = Column(String(200), nullable=True)
    stripe_invoice_number = Column(String(50), nullable=True)
    stripe_payment_receipt_url = Column(String(200), nullable=True)

class Plans(Base):
    __tablename__ = "plans"

    name = Column(String(50), nullable=False)
    description = Column(String(200), nullable=False)
    price = Column(Integer, nullable=False)
    data_limit = Column(Float, nullable=False)
    creation_time = Column(DateTime, nullable=False)
    is_archived = Column(Boolean, nullable=True)
    archived_time = Column(DateTime, nullable=True)
    stripe_price_id = Column(String(50), nullable=False)
