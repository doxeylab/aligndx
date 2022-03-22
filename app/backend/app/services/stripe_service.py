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

# Stripe Error Handler
def error_handler(error: Exception):
    raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = f"Stripe Error :{error}")
