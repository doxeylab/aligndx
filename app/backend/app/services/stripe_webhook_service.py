from app.services import invoice_service, subscription_service, stripe_service, customer_service

# Webhook: invoice.paid
async def handle_invoice_paid(req, db):
    # Extract the Stripe Subscription id from the Strip Invoice Object
    stripe_sub_id = req["data"]["object"]["subscription"]
    stripe_customer_id = req["data"]["object"]["customer"]

    # Get subscription from db
    sub = await subscription_service.get_subscription_by_stripe_id(db, stripe_sub_id)
    if sub == None: return False

    # Get Subscription object from Stripe incl. Invoice & Payment Intent
    sub_stripe = await stripe_service.get_subscription(
        stripe_sub_id,
        ["latest_invoice.payment_intent.payment_method"]
    )

    # Check if plan downgrade was requested and update db if needed
    # If subscription has scheduled plan id set means need update db to reflect new plan
    if sub.scheduled_plan_id:
        # TODO: confirm stripe sub plan same as scheduled plan id
        await subscription_service.process_plan_downgrade(db, sub)

    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

    # Update Customer & Subscription items in db
    await subscription_service.update_after_payment_success(db, sub.id, sub_stripe)
    await customer_service.update_payment_method(db, sub.customer_id, sub_stripe.latest_invoice, stripe_customer_id)

    return True

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
