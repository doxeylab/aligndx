# FastAPI
from fastapi import HTTPException, status

# Database Models & DAL
from app.db.dals.payments import SubscriptionsDal, PlansDal
from app.auth.models import UserDTO
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, CreateNewSubscription, UpdateInitialSubscription, UpdateItemsAfterPaymentSuccess, SetAutoRenew, SubCancelResponse, UpdateItemsAfterCancel, UpgradeSubscription, DowngradeSubscription, CancelDowngradeSubscription, ProcessDowngradeSubscription, UpdateData

# Services
from app.services import stripe_service, customer_service, plans_service

# Utils
from datetime import datetime

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest, db):
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
            raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,
                        detail = "Only an Admin can create new subscriptions")
        customer_id = current_user.customer_id

    customer = await customer_service.get_by_id(db, customer_id)

    # Create 'inactive' subscription in db
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
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.get_subscription_by_stripe_id(stripe_id)

async def get_active_subscription(db, current_user: UserDTO):
    subs_dal = SubscriptionsDal(db)
    return await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

async def update_after_payment_success(db, subs_id, sub_stripe):
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
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "An active subscription does not exist!")
    
    if subs.auto_renew == False:
        raise HTTPException(status_code = 400, detail = "Subscription cancel request already submitted.")
    
    # If subs already scheduled to downgrade: cancel the downgrade req first
    if subs.stripe_schedule_id:
        await cancel_downgrade(db, current_user)

    # Submit cancel request to Stripe
    await stripe_service.cancel_subscription(subs.stripe_subscription_id)

    update_items = SetAutoRenew(auto_renew=False)
    await subs_dal.update(subs.id, update_items)

    return SubCancelResponse(current_period_end=subs.current_period_end)

async def cancel_subscription(db, subs_stripe_id, cancel_reason):
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
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

    if subs == None:
        raise HTTPException(status_code = 404, detail = "Subscription does not exist!")

    if subs.auto_renew == True:
        raise HTTPException(status_code = 400, detail = "Existing cancel request not found. Subscription already set to auto-renew.")
    
    # Submit reactivation request to Stripe
    await stripe_service.reactivate_subscription(subs.stripe_subscription_id)

    update_items = SetAutoRenew(auto_renew=True)
    await subs_dal.update(subs.id, update_items)

    return 'Subscription reactivated and is set to auto-renew.'

async def change_plan(db, current_user: UserDTO, request):
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(current_user.customer_id)

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
    
    # Check of Subscription is set to cancel at end of period: if yes, reactivate subs first
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

# End of month: Downgrade Plan
async def process_plan_downgrade(db, sub):
    # Scheduled plan id becomes the new plan id
    new_plan = await plans_service.get_plan_by_id(sub.scheduled_plan_id)

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
    '''
    subs_dal = SubscriptionsDal(db)
    active_sub = await subs_dal.get_active_subscription_by_customer_id(customer_id)
    
    if active_sub == None:
        return await subs_dal.get_recently_cancelled_subscription(customer_id)

    return active_sub

async def update_data_usage(db, customer_id, data_amount_mb):
    subs_dal = SubscriptionsDal(db)
    subs = await subs_dal.get_active_subscription_by_customer_id(customer_id)
    
    if subs == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "An active subscription does not exist!")
    new_data_used = subs.data_used + data_amount_mb
    update_items = UpdateData(data_used = new_data_used)
    
    await subs_dal.update(subs.id, update_items)
