import os
from fastapi import HTTPException, status

# Stripe
import stripe
from stripe.error import StripeError

stripe.api_key = os.getenv("STRIPE_KEY")
stripe.max_network_retries = 3

async def create_customer(id, name, email):
    try:
        resp = stripe.Customer.create(
            email = email,
            name = name,
            metadata = {
                "AlignDx_CustomerID": id
            }
        )
        return resp

    except StripeError as error:
        error_handler(error) 

async def create_subscription(customer_id, stripe_customer_id, stripe_price_id, subscription_id):
    try:
        resp = stripe.Subscription.create(
            customer = stripe_customer_id,
            items = [
                {"price": stripe_price_id}
            ],
            metadata = {
                "AlignDx_CustomerID": customer_id,
                "AlignDx_SubscriptionID": subscription_id
            },
            payment_behavior='default_incomplete',
            expand=['latest_invoice.payment_intent']
        )
        return resp

    except StripeError as error:
        error_handler(error)   

async def get_subscription(stripe_subscription_id, expand_list=[]):
    try:
        return stripe.Subscription.retrieve(
                stripe_subscription_id,
                expand = expand_list
            )

    except StripeError as error:
        error_handler(error)

async def create_setup_intent(customer_db):
    try:
        resp = stripe.SetupIntent.create(
            customer = customer_db.stripe_customer_id,
            payment_method_types = ["card"],
            metadata = {
                "AlignDx_Customer_id": customer_db.id,
                "reason": "update-card"
            }
        )
        return resp

    except StripeError as error:
        error_handler(error) 

async def get_payment_method(pm_id):
    try:
        resp = stripe.PaymentMethod.retrieve(pm_id)
        return resp

    except StripeError as error:
        error_handler(error)

async def delete_payment_method(pm_id):
    try:
        resp = stripe.PaymentMethod.detach(pm_id)
        return resp

    except StripeError as error:
        error_handler(error)

async def set_default_payment_method(stripe_customer_id, pm_id):
    try:
        resp = stripe.Customer.modify(
                stripe_customer_id,
                invoice_settings={"default_payment_method": pm_id},
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def cancel_subscription(stripe_subscription_id):
    try:
        resp = stripe.Subscription.modify(
                stripe_subscription_id,
                cancel_at_period_end = True
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def upgrade_subscription(stripe_subscription_id, stripe_price_id):
    try:
        subscription = await get_subscription(stripe_subscription_id)
        resp = stripe.Subscription.modify(
                subscription.id,
                cancel_at_period_end=False,
                proration_behavior='create_prorations',
                items=[{
                    'id': subscription['items']['data'][0].id,
                    'price': stripe_price_id,
                }]
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def schedule_downgrade_subscription(stripe_subscription_id, stripe_price_id):
    # Create a Stripe Subscription Schedule to update subs price starting next period
    try:
        subscription = await get_subscription(stripe_subscription_id)
        schedule = stripe.SubscriptionSchedule.create(from_subscription = subscription.id)

        schedule = stripe.SubscriptionSchedule.modify(
                schedule.id,
                end_behavior = 'release',
                phases = [{
                        # Past Phase
                        'start_date': subscription.current_period_start,
                        'end_date': 'now',
                        'items': [{
                                'price': subscription['items']['data'][0]['plan']['id']
                        }]
                    },{
                        # Current Phase - Now to end of period with current price id
                        'start_date': 'now',
                        'end_date': subscription.current_period_end,
                        'items': [{
                                'price': subscription['items']['data'][0]['plan']['id']
                        }]
                    },
                    {
                        # Second Phase - Next period with the downgraded plan price id
                        'start_date': subscription.current_period_end,
                        'proration_behavior': 'none',
                        'items': [{
                                'price': stripe_price_id
                        }]
                    }]
            )
        return schedule

    except StripeError as error:
        error_handler(error)

async def cancel_subscription_schedule(schedule_id):
    try:
        return stripe.SubscriptionSchedule.release(schedule_id)

    except StripeError as error:
        error_handler(error)

async def get_upcoming_invoice(stripe_customer_id):
    try:
        resp = stripe.Invoice.upcoming(
                customer = stripe_customer_id,
            )
        return resp

    except StripeError as error:
        error_handler(error)

# Stripe Error Handler
def error_handler(error: Exception):
    raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = f"Stripe Error :{error}")
