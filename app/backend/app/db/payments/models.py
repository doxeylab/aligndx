from app.db.database import metadata
from sqlalchemy import Column, DateTime, String, Table, Integer, ForeignKey, Boolean

customers = Table(
    "customers",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("email", String(50), nullable=False),
    Column("stripe_customer_id", String(50), nullable=True),
    Column("creation_time", DateTime, nullable=False),
    Column("admin_user_id", Integer, ForeignKey("users.id"), nullable=False),
)

subscriptions = Table(
    "subscriptions",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("is_active", Boolean, nullable=False),
    Column("status", String(50), nullable=False),
    Column("plan_description", String(50), nullable=False),
    Column("initial_start_date", DateTime, nullable=True),
    Column("is_cancelled", Boolean, nullable=True),
    Column("cancel_date", DateTime, nullable=True),
    Column("current_period_start", DateTime, nullable=True),
    Column("current_period_end", DateTime, nullable=True),
    Column("customer_id", Integer, ForeignKey("customers.id"), nullable=False),
    Column("stripe_customer_id", String(50), nullable=False),
    Column("stripe_latest_invoice_id", String(50), nullable=True),
    Column("stripe_subscription_id", String(50), nullable=True),
    Column("stripe_price_id", String(50), nullable=True),
    Column("stripe_default_payment_method_id", String(50), nullable=True),
    Column("payment_card_type", String(50), nullable=True),
    Column("card_last4", String(50), nullable=True),
    Column("card_expiry", String(50), nullable=True),
    Column("creation_time", DateTime, nullable=False)
)

invoices = Table(
    "invoices",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("status", String(50), nullable=False),
    Column("amount_paid", Integer, nullable=False),
    Column("amount_remaining", Integer, nullable=False),
    Column("payment_card_type", String(50), nullable=True),
    Column("payment_card_last4", String(50), nullable=True),
    Column("payment_card_expiry", String(50), nullable=True),
    Column("invoice_date", DateTime, nullable=False),
    Column("billing_period_start", DateTime, nullable=False),
    Column("billing_period_end", DateTime, nullable=False),
    Column("stripe_invoice_id", String(50), nullable=False),
    Column("stripe_payment_intent_id", String(50), nullable=True),
    Column("stripe_payment_method_id", String(50), nullable=True),
    Column("stripe_invoice_url", String(50), nullable=True),
    Column("stripe_payment_receipt_url", String(50), nullable=True),
    Column("subscription_id", Integer, ForeignKey("subscriptions.id"), nullable=False),
    Column("customer_id", Integer, ForeignKey("customers.id"), nullable=False),
    Column("creation_time", DateTime, nullable=False)
)