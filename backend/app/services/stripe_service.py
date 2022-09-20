# FastAPI
from fastapi import HTTPException, status

# Settings
from app.config.settings import settings

# Stripe
import stripe
from stripe.error import StripeError

stripe.api_key = settings.stripe_secret_key
stripe.max_network_retries = 3

async def create_customer(id, name, email):
    """
    This method creates a new customer in Stripe
    :param id: id (UUID) of the customer in our db
    :param name: name of the customer to be created
    :param emai: email of the customer
    
    Returns: Stripe's Customer Object
    Docs: https://stripe.com/docs/api/customers/create
    """
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
    """
    This method creates a new subscription with status = 'incomplete'.
    :param customer_id: id (UUID) of customer in our db
    :param stripe_customer_id: Stripe customer Id of the above customer
    :param stripe_price_id: Stripe Price Id of the plan to subscribe to
    :param subscription_id: id (UUID) of the incomplete subscription in db

    Returns: Stripe's Subscription Object
    Docs: https://stripe.com/docs/api/subscriptions/object
    """
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
    """
    This method retrives the subscription object for a given
    subscription id.
    :param stripe_subscription_id: Stripe's subscription Id
    :param expand_list: used to expand objects part of the 
        subscription object i.e. Invoice

    Returns: Stripe's Subscription Object
    Docs: https://stripe.com/docs/api/subscriptions/object
    """
    try:
        return stripe.Subscription.retrieve(
                stripe_subscription_id,
                expand = expand_list
            )

    except StripeError as error:
        error_handler(error)

async def create_setup_intent(customer_db):
    """
    Setup intent is used to update a customer's payment method
    The 'client_secret' is used by front-end and linked to Stripe Credit Card Form elements
        to process credit card.
    
    Returns: 'SetupIntent' object which contains a 'client_secret'.
    Docs: https://stripe.com/docs/api/setup_intents/object
    """
    try:
        resp = stripe.SetupIntent.create(
            customer = customer_db.stripe_customer_id,
            payment_method_types = ["card"],
        )
        return resp

    except StripeError as error:
        error_handler(error) 

async def get_payment_method(pm_id):
    """
    This method returns the 'Payment Method' object for given payment method id
    :param pm_id: Stripe payment method id

    Returns: Stripe's Payment Method object
    Docs: https://stripe.com/docs/api/payment_methods/object
    """
    try:
        resp = stripe.PaymentMethod.retrieve(pm_id)
        return resp

    except StripeError as error:
        error_handler(error)

async def delete_payment_method(pm_id):
    """
    This method takes the payment method id of a credit card and deletes it.
    :param pm_id: Stripe payment method id

    Returns: Stripe's Payment Method object
    Docs: https://stripe.com/docs/api/payment_methods/detach
    """
    try:
        resp = stripe.PaymentMethod.detach(pm_id)
        return resp

    except StripeError as error:
        error_handler(error)

async def set_default_payment_method(stripe_customer_id, stripe_payment_method_id):
    """
    This method takes the payment method id of a credit card and sets it as
    the default card to pay for all future invoices.

    Returns: Stripe's Customer Object
    Docs: https://stripe.com/docs/api/customers/update
    """
    try:
        resp = stripe.Customer.modify(
                stripe_customer_id,
                invoice_settings={"default_payment_method": stripe_payment_method_id},
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def cancel_subscription(stripe_subscription_id):
    """
    This method is used to request to cancel a subscription at
    the end of the current period.
    :param stripe_subscription_id: Stripe Subscription Id

    Returns: Stripe's Subscription Object
    Docs: https://stripe.com/docs/api/subscriptions/object
    """
    try:
        resp = stripe.Subscription.modify(
                stripe_subscription_id,
                cancel_at_period_end = True
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def reactivate_subscription(stripe_subscription_id):
    """
    This method is used to reactivate an existing subscription
    which has not been cancelled yet.
    :param stripe_subscription_id: Stripe Subscription Id

    Returns: Stripe's Subscription Object
    Docs: https://stripe.com/docs/api/subscriptions/object
    """
    try:
        resp = stripe.Subscription.modify(
                stripe_subscription_id,
                cancel_at_period_end = False
            )
        return resp

    except StripeError as error:
        error_handler(error)

async def upgrade_subscription(stripe_subscription_id, stripe_price_id):
    """
    This method is used to upgrade subscription plan.
    Upgrades means higher price compared to current plan
    :param stripe_subscription_id: Stripe Subscription Id
    :param stripe_price_id: Stripe Price Id of the new plan

    Returns: Stripe's Subscription Object or throws error if
                payment was unsuccessful.
    Docs: https://stripe.com/docs/api/subscriptions/object
    """
    try:
        subscription = await get_subscription(stripe_subscription_id)
        resp = stripe.Subscription.modify(
                subscription.id,
                cancel_at_period_end=False,
                proration_behavior='always_invoice',
                payment_behavior='error_if_incomplete',
                items=[{
                    'id': subscription['items']['data'][0].id,
                    'price': stripe_price_id,
                }]
            )
        return resp

    except StripeError as error:
        if error.http_status == 402:
            raise HTTPException(status_code = status.HTTP_402_PAYMENT_REQUIRED,
                detail = 'Credit card declined. Please update your payment method details.')
        else:
            error_handler(error)

async def schedule_downgrade_subscription(stripe_subscription_id, stripe_price_id):
    """
    This method is used to downgrade subscription plan.
    downgrade means lower price compared to current plan.
    An update is scheduled using Stripe's Schedule object
    to downgrade plan at the end ofthe current period.
    :param stripe_subscription_id: Stripe Subscription Id
    :param stripe_price_id: Stripe Price Id of the new plan

    Returns: Stripe's Schedule Object
    Docs: https://stripe.com/docs/api/subscription_schedules/object
    """
    # Create a Stripe Subscription Schedule to update subs price starting next period
    try:
        subscription = await get_subscription(stripe_subscription_id)
        schedule = stripe.SubscriptionSchedule.create(from_subscription = subscription.id)

        schedule = stripe.SubscriptionSchedule.modify(
                schedule.id,
                end_behavior = 'release',
                phases = [{
                        # Past Phase - Current Period Start to Now
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
                        # Future Phase - Next period with the downgraded plan price id
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
    """
    This method is used to release subscription schedule.
    It cancels any future changes and stays on the plan it
    is currently on.
    :param schedule_id: Stripe Subscription Schedule Id

    Returns: Stripe's Schedule Object
    Docs: https://stripe.com/docs/api/subscription_schedules/object
    """
    try:
        return stripe.SubscriptionSchedule.release(schedule_id)

    except StripeError as error:
        error_handler(error)

# Stripe Error Handler
def error_handler(error: Exception):
    raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = f"Stripe Error :{error}")
