# Models & Repos
from app.db.dals.payments import CustomersDal, InvoicesDal, SubscriptionsDal
from app.auth.models import UserDTO

from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, NewSubscription, UpdateSubscription
from app.models.schemas.payments.customers import NewCustomer, UpdateCustomer
from app.models.schemas.payments.invoices import NewInvoice


# Services
from app.services import stripe_service

# Utils
from datetime import datetime

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest):
    # Create customer in db
    new_customer = NewCustomer(
        name=current_user.name,
        email=current_user.email,
        admin_user_id=current_user.id,
        creation_time=datetime.now()
    )
    customer_id = await CustomersDal.create_customer(new_customer)
    customer = await CustomersDal.get_by_id(customer_id)

    # Create customer in Stripe & update db
    stripe_customer = await stripe_service.create_customer(customer)
    update_payload=UpdateCustomer(
        stripe_customer_id=stripe_customer.id
    )
    await CustomersDal.update(customer_id, update_payload)

    # Create 'inactive' subscription in db
    new_subscription = NewSubscription(
        is_active=False,
        status="initialize",
        plan_description="Standard Plan",
        stripe_price_id=req.stripe_price_id,
        customer_id=customer_id,
        stripe_customer_id=stripe_customer.id,
        creation_time=datetime.now()
    )
    
    subscription_id = await SubscriptionsDal.create(new_subscription)

    # Create subscription in Stripe & update db
    sub = await stripe_service.create_subscription(
            customer_id, stripe_customer.id, req.stripe_price_id, subscription_id
        )
    client_secret = sub.latest_invoice.payment_intent.client_secret
    update_items = UpdateSubscription(
        stripe_subscription_id=sub.id,
        stripe_latest_invoice_id=sub.latest_invoice.id,
        status=sub.status,
        initial_start_date=datetime.fromtimestamp(sub.start_date),
        current_period_start=datetime.fromtimestamp(sub.current_period_start),
        current_period_end=datetime.fromtimestamp(sub.current_period_end),
    ) 

    await SubscriptionsDal.update(subscription_id, update_items)

    # Create invoice for the subscription
    invoice = sub.latest_invoice
    new_invoice = NewInvoice(
        status=invoice.status,
        amount_due=invoice.amount_due,
        amount_paid=invoice.amount_paid,
        currency=invoice.currency,
        invoice_date=datetime.fromtimestamp(invoice.created),
        billing_period_start=datetime.fromtimestamp(invoice.period_start),
        billing_period_end=datetime.fromtimestamp(invoice.period_end),
        stripe_invoice_id=invoice.id,
        stripe_payment_intent_id=invoice.payment_intent.id,
        stripe_invoice_url=invoice.hosted_invoice_url,
        stripe_invoice_number=invoice.number,
        subscription_id=subscription_id,
        customer_id=customer_id,
        creation_time=datetime.now(),
    )
    await InvoicesDal.create(new_invoice)

    return client_secret