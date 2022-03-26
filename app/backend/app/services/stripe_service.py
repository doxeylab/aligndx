import os
from fastapi import HTTPException, status
from app.models.schemas.payments.customers import CustomerDTO

# Stripe
import stripe
from stripe.error import StripeError

stripe.api_key = os.getenv("STRIPE_KEY")
stripe.max_network_retries = 3

async def create_customer(customer: CustomerDTO):
    try:
        resp = stripe.Customer.create(
            email = customer.email,
            name = customer.name,
            metadata = {
                "AlignDx_CustomerID": customer.id
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

async def create_setup_intent(stripe_customer_id):
    try:
        resp = stripe.SetupIntent.create(
            customer = stripe_customer_id,
            payment_method_types=["card"],
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

async def change_subscription_price(stripe_subscription_id, stripe_price_id):
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

# Stripe Error Handler
def error_handler(error: Exception):
    raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = f"Stripe Error :{error}")
