# Database Models & DAL
from app.db.dals.payments import CustomersDal, SubscriptionsDal
from app.auth.models import UserDTO
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, CreateNewSubscription, UpdateInitialSubscription, UpdateItemsAfterPaymentSuccess
from app.models.schemas.payments.customers import NewCustomer, UpdateCustomerStripeId

# Services
from app.services import stripe_service

# Utils
from datetime import datetime

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest, db):
    # Create customer in db
    new_customer = NewCustomer(
        name = current_user.name,
        email = current_user.email,
        admin_user_id = current_user.id,
        creation_time = datetime.now()
    )

    customer_dal = CustomersDal(db)
    customer_id = await customer_dal.create(new_customer)
    customer = await customer_dal.get_by_id(customer_id)

    # Create customer in Stripe & update db
    stripe_customer = await stripe_service.create_customer(customer)
    update_payload = UpdateCustomerStripeId(
        stripe_customer_id = stripe_customer.id
    )
    await customer_dal.update(customer_id, update_payload)

    # Create 'inactive' subscription in db
    new_subscription = CreateNewSubscription(
        is_active = False,
        status = "initialize",
        is_paid = False,
        plan_description = "Standard Plan",
        stripe_price_id = req.stripe_price_id,
        customer_id = customer_id,
        stripe_customer_id = stripe_customer.id,
        creation_time = datetime.now()
    )
    subs_dal = SubscriptionsDal(db)
    subscription_id = await subs_dal.create(new_subscription)

    # Create subscription in Stripe & update db
    sub = await stripe_service.create_subscription(
        customer_id, stripe_customer.id, req.stripe_price_id, subscription_id
    )
    client_secret = sub.latest_invoice.payment_intent.client_secret
    update_items = UpdateInitialSubscription(
        stripe_subscription_id = sub.id,
        initial_start_date = datetime.fromtimestamp(sub.start_date),
    ) 

    await subs_dal.update(subscription_id, update_items)

    return client_secret

async def get_subscription_by_stripe_id(db, stripe_id):
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.get_subscription_by_stripe_id(stripe_id)

async def update_after_payment_success(db, subs_id, sub_stripe):
    update_items = UpdateItemsAfterPaymentSuccess(
        is_active = True,
        status = "paid",
        is_paid = True,
        stripe_latest_invoice_id = sub_stripe.latest_invoice.id,
        current_period_start = datetime.fromtimestamp(sub_stripe.current_period_start),
        current_period_end = datetime.fromtimestamp(sub_stripe.current_period_end),
    )
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.update(subs_id, update_items)