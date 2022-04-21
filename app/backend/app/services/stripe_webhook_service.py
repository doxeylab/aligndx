from app.services import invoice_service, subscription_service, stripe_service, customer_service

async def handle_invoice_pmt_succeeded(db, req):
    # Extract the Stripe Subscription id from the Stripe Invoice Object
    stripe_sub_id = req["data"]["object"]["subscription"]
    stripe_customer_id = req["data"]["object"]["customer"]
    billing_reason = req["data"]["object"]["billing_reason"]

    # Get subscription from db
    sub = await subscription_service.get_subscription_by_stripe_id(db, stripe_sub_id)
    if sub == None: return False

    # Get Subscription object from Stripe incl. Invoice & Payment Intent
    sub_stripe = await stripe_service.get_subscription(
        stripe_sub_id,
        ["latest_invoice.payment_intent.payment_method"]
    )

    # Check billing reason for invoice pmt and direct request accordingly
    if billing_reason == 'subscription_create' and sub_stripe.status == 'active':
        await activate_initial_subscription(db, sub, sub_stripe, stripe_customer_id)
    elif billing_reason == 'subscription_cycle' and sub_stripe.status == 'active':
        await process_subscription_renewal(db, sub, sub_stripe)
    elif billing_reason == 'subscription_update':
        await process_other_payments(db, sub, sub_stripe)

    return True

async def activate_initial_subscription(db, sub, sub_stripe, stripe_customer_id):
     # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

    # Update Customer & Subscription items in db
    await subscription_service.update_after_payment_success(db, sub.id, sub_stripe)
    await customer_service.update_payment_method(db, sub.customer_id, sub_stripe.latest_invoice, stripe_customer_id)

async def process_subscription_renewal(db, sub, sub_stripe):
    """
    Process month-end successful payments for auto-renewals
    """

    # Check if plan downgrade was scheduled as they take effect end-of-month
    # If subscription has scheduled plan id set means need update db to reflect new plan
    if sub.scheduled_plan_id:
        # TODO: confirm stripe sub plan same as scheduled plan id
        await subscription_service.process_plan_downgrade(db, sub)

    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

    # Update Subscription items in db
    await subscription_service.update_after_payment_success(db, sub.id, sub_stripe)

async def process_other_payments(db, sub, sub_stripe):
    """
    Process all other payments made during the month i.e. plan upgrade proration charges
    """

    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

async def handle_payment_method(req, db):
    # Check if this req was triggered due to update-card as metadata was set to update card
    metadata = req["data"]["object"]["metadata"]
    if metadata == {} or 'reason' not in metadata or metadata['reason'] != 'update-card':
        return True

    stripe_customer_id = req["data"]["object"]["customer"]
    payment_method_id = req["data"]["object"]["payment_method"]

    await customer_service.replace_payment_method(db, stripe_customer_id, payment_method_id)
    return True

async def handle_cancellation(req, db):
    # Extract the Stripe Subscription id from the Stripe Subscription Object
    stripe_sub_id = req["data"]["object"]["id"]
    cancel_reason = "Cancelled - customer request"

    await subscription_service.cancel_subscription(db, stripe_sub_id, cancel_reason)
    return True

async def handle_failed_payment(db, subscription):
    # Handle Subscription status = "past_due" --> Cancel Subscription
    cancel_reason = "Cancelled - non-payment"
    
    await subscription_service.cancel_subscription(db, subscription["id"], cancel_reason)
    return True

async def handle_incomplete_subs(db, subscription):
    """
    Subscriptions with 'incomplete_expired' status are subs where the payment process was never completed.
    In the db they are marked with status "incomplete". Stripe sends this event after 24 hours
    if the payment process was not completed.
    """
    
    await subscription_service.delete_incomplete_subscription(db, subscription["id"])
    return True
