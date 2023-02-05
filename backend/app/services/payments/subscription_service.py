# FastAPI
from fastapi import HTTPException, status

# Database Models & DAL
from app.db.dals.payments import SubscriptionsDal, PlansDal
from app.auth.models import UserDTO
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, CreateNewSubscription, UpdateInitialSubscription, UpdateItemsAfterPaymentSuccess, SetAutoRenew, SubCancelResponse, UpdateItemsAfterCancel, UpgradeSubscription, DowngradeSubscription, CancelDowngradeSubscription, ProcessDowngradeSubscription, UpdateData

# Services
from app.services import stripe_service, plans_service

# Utils
from datetime import datetime

from backend.app.services.payments import customer_service

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest, db):
    """
    Create a new subscription with status = 'incomplete'.

    It creates a new subscription object in our db and with Stripe as well.
    returns: client secret used by front-end to render the Stripe's payment element.
    Upon successful payment: Stripe sends a webhook with event 'invoice.paid" which
    is handled in the Stripe Webhooks endpoint and subscription is set to 'active'

    :param request: contains the plan id for subscription

    Stripe Docs: https://stripe.com/docs/api/subscriptions/object
    """
    # Check if plan is valid and available (not archived)
    plans_dal = PlansDal(db)
    plan = await plans_dal.get_available_plan_by_id(req.plan_id)
    if plan == None:
            raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "This plan doesn't exist or isn't available")

    # Check if an active subs already exists
    subs_dal = SubscriptionsDal(db)
    if current_user.customer_id:
        sub = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)
        if sub:
            raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "An active subscription already exists for customer")

    # Create customer in db & stripe if doesn't exist
    customer_id = None
    if current_user.customer_id == None:
        customer_id = await customer_service.create_customer(db, current_user)
    else:
        if current_user.is_admin == False:
            raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Admin access required.")
        customer_id = current_user.customer_id

    customer = await customer_service.get_by_id(db, customer_id)

    # Create 'incomplete' subscription in db
    new_subscription = CreateNewSubscription(
        customer_id = customer.id,
        plan_id = plan.id,
        is_active = False,
        status = "incomplete",
        is_paid = False,
        data_used = 0.0,
        data_limit_mb = plan.data_limit_mb,
        auto_renew = False,
        allow_downgrade = True,
        creation_time = datetime.now()
    )
    subscription_id = await subs_dal.create(new_subscription)

    # Create subscription in Stripe & update db
    sub = await stripe_service.create_subscription(
        customer.id, customer.stripe_customer_id, plan.stripe_price_id, subscription_id
    )
    client_secret = sub.latest_invoice.payment_intent.client_secret
    update_items = UpdateInitialSubscription(
        stripe_subscription_id = sub.id,
        initial_start_date = datetime.fromtimestamp(sub.start_date),
    ) 

    await subs_dal.update(subscription_id, update_items)

    return client_secret

async def get_subscription_by_stripe_id(db, stripe_id):
    """
    Retrieves a subscription by Stripe subscription id, if exists.
    returns: subscription if found, else null
    :param stripe_id: Stripe subscription id of an existing subscription
    """
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.get_subscription_by_stripe_id(stripe_id)

async def get_active_subscription(db, current_user: UserDTO):
    """
    Retrieves an active subscription
    returns: subscription if found, else null
    """
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

async def update_after_payment_success(db, subs_id, sub_stripe):
    """
    Updates the database upon a successful payment for either first subscription or renewal
    :param subs_id: id of the subscrioption to be updated
    :param sub_stripe: the Stripe subscription object returned from Stripe
    """
    update_items = UpdateItemsAfterPaymentSuccess(
        is_active = True,
        status = "paid",
        is_paid = True,
        auto_renew = True,
        stripe_latest_invoice_id = sub_stripe.latest_invoice.id,
        current_period_start = datetime.fromtimestamp(sub_stripe.current_period_start),
        current_period_end = datetime.fromtimestamp(sub_stripe.current_period_end),
        allow_downgrade = True,
        data_used = 0.0
    )
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.update(subs_id, update_items)

async def request_cancellation(db, current_user: UserDTO):
    """
    Front-end user requests to cancel subscription

    It sets auto renewal to false and makes a request to Stripe to 
    cancel the subscription at the end of current period.
    Returns: the last day of subscription which is current period end date.
    """

    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "An active subscription does not exist!")
    
    if subs.auto_renew == False:
        raise HTTPException(status_code = 400, detail = "Subscription cancel request already submitted.")
    
    # If there is an existing plan downgrade request: need to cancel the downgrade req first
    if subs.stripe_schedule_id:
        await cancel_downgrade(db, current_user)

    # Submit cancel request to Stripe
    await stripe_service.cancel_subscription(subs.stripe_subscription_id)

    update_items = SetAutoRenew(auto_renew=False)
    await subs_dal.update(subs.id, update_items)

    return SubCancelResponse(current_period_end=subs.current_period_end)

async def cancel_subscription(db, subs_stripe_id, cancel_reason):
    """
    Update DB to reflect subscription cancellation.

    This function is only invoked by Stripe Webhook. It updates the db
    table to reflect cancellation and removes the customer's payment method details.
    :param subs_stripe_id: subscription's Stripe Id as passed from Stripe
    :param cancel_reason: the reason for the cancellation of subscription
    """
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_subscription_by_stripe_id(subs_stripe_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "Subscription does not exist!")
    
    # A subs could have already been cancelled due to non-payment
    if subs.is_cancelled == True:
        return
    
    update_items = UpdateItemsAfterCancel(
        is_active = False,
        status = cancel_reason,
        is_paid = False,
        is_cancelled = True,
        cancel_date = datetime.now(),
        auto_renew = False
    )
    await subs_dal.update(subs.id, update_items)

    # Delete payment method on db & with Stripe
    await customer_service.delete_payment_method(db, subs.customer_id)

    return True

async def reactivate_subscription(db, current_user: UserDTO):
    """
    Undo a subscription cancellation request if the subscription is active and not yet cancelled.

    This function is invoked by front-end when a user was to undo their existing request
    to cancel their subscription at the end of current period. It updates the db
    table to set auto renewal to true and reactivates the subscription with Stripe too.
    """
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "An active subscription not found.")

    if subs.auto_renew == True:
        raise HTTPException(status_code = 400, detail = "Existing cancel request not found. Subscription already set to auto-renew.")
    
    # Submit reactivation request to Stripe
    await stripe_service.reactivate_subscription(subs.stripe_subscription_id)

    update_items = SetAutoRenew(auto_renew=True)
    await subs_dal.update(subs.id, update_items)

    return 'Subscription reactivated and is set to auto-renew.'

async def change_plan(db, current_user: UserDTO, request):
    """
    Process current user request to change plan

    A change request is considered either an upgrade or downgrade which
    depends on the price difference between the current plan vs the new
    requested plan.
    Plan upgrades are processed immediately while dowgrades are processed
    at the end of current period.

    :param request: id of the new plan that the curent user wants to replace with.
    """
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "An active subscription does not exist!")

    # get plan entities from db for current and new requested plan
    plans_dal = PlansDal(db)
    current_plan = await plans_dal.get_by_id(subs.plan_id)
    new_plan = await plans_dal.get_available_plan_by_id(request.plan_id)

    if subs == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "An active subscription does not exist!")
    
    if current_plan.name == new_plan.name:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "Customer already on the requested plan.")
    
    # Check if a downgrade is already scheduled
    if subs.scheduled_plan_id:
        scheduled_plan = await plans_dal.get_by_id(subs.scheduled_plan_id)
        if scheduled_plan.name == new_plan.name:
            raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                            detail = f"Request to change to plan name: '{scheduled_plan.name}' already submitted.")
    
    # Check if Subscription is already set to cancel: if yes, reactivate subs first
    if subs.auto_renew == False:
        await reactivate_subscription(db, current_user)

    response = None
    if new_plan.base_price >= current_plan.base_price:
        # Upgrade Plan - Change Immediately, set new higher data limit
        await stripe_service.upgrade_subscription(subs.stripe_subscription_id, new_plan.stripe_price_id)
        update_items = UpgradeSubscription(
            plan_id = new_plan.id,
            data_limit_mb = new_plan.data_limit_mb,
        )
        await subs_dal.update(subs.id, update_items)
        # TODO: use upcoming-invoice API to estimate next invoice charges
        response = "Subscription plan upgraded successfully."
    else:
        # Downgrade Plan - Schedule a change for end of current period
        stripe_schedule = await stripe_service.schedule_downgrade_subscription(subs.stripe_subscription_id, new_plan.stripe_price_id)
        update_items = DowngradeSubscription(
            scheduled_plan_id = new_plan.id,
            stripe_schedule_id = stripe_schedule.id,
            allow_downgrade = False
        )
        await subs_dal.update(subs.id, update_items)
        response = "Subscription plan will be changed starting next billing cycle."

    return response

async def cancel_downgrade(db, current_user: UserDTO):
    """
    Undo an existing request to downgrade plan and keep the current plan.
    """
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "An active subscription does not exist!")
    
    if subs.scheduled_plan_id == None:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "An existing request for downgrading plan doesn't exist.")
    
    await stripe_service.cancel_subscription_schedule(subs.stripe_schedule_id)
    update_items = CancelDowngradeSubscription(
            scheduled_plan_id = None,
            stripe_schedule_id = None,
            allow_downgrade = True
    )
    await subs_dal.update(subs.id, update_items)
    return "Request to downgrade plan cancelled."

async def process_plan_downgrade(db, sub):
    """
    Process plan downgrade at the end of current period

    This function is only triggered via Stripe Webhook. When the end of
    current period reaches, Stripe will change the plan on their side and
    trigger a 'invoice.paid' event upon successful payment. While processing
    the payment for new period, we check if there was an request for plan
    downgrade and this function is called.

    :param sub: the active subscription
    """
    await stripe_service.cancel_subscription_schedule(sub.stripe_schedule_id)
    # Scheduled plan id becomes the new plan id
    new_plan = await plans_service.get_plan_by_id(db, sub.scheduled_plan_id)

    subs_dal = SubscriptionsDal(db)
    update_items = ProcessDowngradeSubscription(
            scheduled_plan_id = None,
            stripe_schedule_id = None,
            allow_downgrade = True,
            plan_id = new_plan.id,
            data_used = 0.0,
            data_limit_mb = new_plan.data_limit_mb,
    )
    await subs_dal.update(sub.id, update_items)

async def get_recent(db, customer_id):
    '''
    returns either an active subscription or a most recently cancelled one.

    The returned subscription object is used in the front-end settings page
    to show the current active subscription or the most recently cancelled
    subscription.
    :param customer_id: the customer id to lookup the subscription for.
    '''
    subs_dal = SubscriptionsDal(db)
    active_sub = await subs_dal.get_active_subscription_by_customer_id(customer_id)
    
    if active_sub == None:
        return await subs_dal.get_recently_cancelled_subscription(customer_id)

    return active_sub

async def update_data_usage(db, customer_id, data_amount_mb):
    '''
    This method is called to update the data used by the customer

    :param customer_id: the customer id to lookup the subscription for.
    :param data_amount_mb: the amount of data to be added to data used field.
    '''
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(customer_id)
    
    if subs == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "An active subscription does not exist!")

    new_data_used = subs.data_used + data_amount_mb
    update_items = UpdateData(data_used = new_data_used)
    
    await subs_dal.update(subs.id, update_items)

async def delete_incomplete_subscription(db, subs_stripe_id):
    """
    Delete subscription where status = 'incomplete'.
    This method is invoked through Stripe Webhooks.

    :param subs_stripe_id: subscription's Stripe Id as passed from Stripe
    """
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_subscription_by_stripe_id(subs_stripe_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "Subscription does not exist!")
    
    if subs.is_active == False and subs.status == 'incomplete':
        await subs_dal.delete_by_id(subs.id)
