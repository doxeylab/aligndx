# Database Models & DAL
from app.db.dals.payments import SubscriptionsDal
from app.db.dals.users import UsersDal
from app.models.schemas.users import SetAdminUpdateItems
from app.auth.models import UserDTO
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, CreateNewSubscription, UpdateInitialSubscription, UpdateItemsAfterPaymentSuccess

# Services
from app.services import stripe_service, customer_service

# Utils
from datetime import datetime

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest, db):
    # Create customer in db
    customer = await customer_service.create_customer(db, current_user)

    # Set current user as admin
    users_dal = UsersDal(db)
    update_user = SetAdminUpdateItems(
        customer_id = customer.id,
        is_admin = True
    )
    await users_dal.update(current_user.id, update_user)

    # Create customer in Stripe & update db
    stripe_customer = await stripe_service.create_customer(customer)
    await customer_service.update_customer(db, customer.id, stripe_customer.id)

    # Create 'inactive' subscription in db
    new_subscription = CreateNewSubscription(
        is_active = False,
        status = "initialize",
        is_paid = False,
        plan_description = "Standard Plan",
        stripe_price_id = req.stripe_price_id,
        customer_id = customer.id,
        stripe_customer_id = stripe_customer.id,
        creation_time = datetime.now()
    )
    subs_dal = SubscriptionsDal(db)
    subscription_id = await subs_dal.create(new_subscription)

    # Create subscription in Stripe & update db
    sub = await stripe_service.create_subscription(
        customer.id, stripe_customer.id, req.stripe_price_id, subscription_id
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