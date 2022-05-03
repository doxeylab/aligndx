from app.services import invoice_service, subscription_service, stripe_service, customer_service

async def handle_invoice_pmt_succeeded(db, req):
    """
    Process 'invoice.paid' event and handle successful payments

    :param req: contains the Stripe's Invoice Object
                invoice = req["data"]["object"]
    
    Stripe Docs: https://stripe.com/docs/api/invoices/object
    Stripe Docs: https://stripe.com/docs/api/subscriptions/object
    """
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
    """
    Update the database upon successful inital payment

    Create an invoice entry, update the incomplete subscription and activate it and
    capture the details for payment method used.

    :param sub: subscription object from our database
    :param sub_stripe: subscription object from Stripe
    :param stripe_customer_id: a customer's Stripe id
    """
     # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

    # Update Subscription items in db
    await subscription_service.update_after_payment_success(db, sub.id, sub_stripe)

    # Update payment card details in the customer table
    await customer_service.set_payment_method(db, sub.customer_id, sub_stripe.latest_invoice, stripe_customer_id)

async def process_subscription_renewal(db, sub, sub_stripe):
    """
    Process month-end successful payments for auto-renewals

    Create a new invoice in db, process plan downgrade (if needed) and
    update subscription items i.e. reset data usage, and other fields

    :param sub: subscription object from our database
    :param sub_stripe: subscription object from Stripe
    """

    # Check if plan downgrade was scheduled as they take effect end-of-month
    # If subscription has scheduled plan id set means need update db to reflect new plan
    if sub.scheduled_plan_id:
        await subscription_service.process_plan_downgrade(db, sub)

    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

    # Update Subscription items in db
    await subscription_service.update_after_payment_success(db, sub.id, sub_stripe)

async def process_other_payments(db, sub, sub_stripe):
    """
    Process all other payments made during the month i.e. plan upgrade proration charges

    :param sub: subscription object from our database
    :param sub_stripe: subscription object from Stripe
    """

    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub.id, sub.customer_id)

async def handle_payment_method(req, db):
    """
    This webhook is triggered when customer successfuly updates their credit card.
    Front-end -> Settings Page -> Update Payment Method, if success this method is triggered.

    :param req: it contains Stripe's Setup Intent object

    Stripe Docs: https://stripe.com/docs/api/setup_intents/object
    """

    stripe_customer_id = req["data"]["object"]["customer"]
    payment_method_id = req["data"]["object"]["payment_method"]

    await customer_service.replace_payment_method(db, stripe_customer_id, payment_method_id)
    return True

async def handle_cancellation(req, db):
    """
    Process 'customer.subscription.deleted' which is triggered upon
    subscription being cancelled at the end of month.
    
    This method is triggered where the customer had requested
    to cancel subscription end of the month.
    Subscription cancellation due to failed payments are handled
    below in the 'handle_failed_payment' method

    :param req: contains subscription object from Stripe
                subs = req["data"]["object"]

    Stripe Docs: https://stripe.com/docs/api/subscriptions/object
    """
    
    # Extract the Stripe Subscription id from the Stripe Subscription Object
    stripe_sub_id = req["data"]["object"]["id"]
    cancel_reason = "Cancelled - customer request"

    await subscription_service.cancel_subscription(db, stripe_sub_id, cancel_reason)
    return True

async def handle_failed_payment(db, sub_stripe):
    """
    Upon failed payment, Stripe sets the status of the subscription to 'past_due' and
    triggers the 'customer.subscription.updated' event with status = 'past_due'.

    We handle that event by cancelling subscription in our database.

    :param sub_stripe: subscription object from Stripe
    """

    # Handle Subscription status = "past_due" --> Cancel Subscription
    cancel_reason = "Cancelled - non-payment"
    
    await subscription_service.cancel_subscription(db, sub_stripe["id"], cancel_reason)
    return True

async def handle_incomplete_subs(db, sub_stripe):
    """
    Subscriptions with 'incomplete_expired' status are where the payment process was completed within 24 hours.
    
    In our db they are marked with status "incomplete". If the payment is not completed within 24 hours,
    Stripe sends this event after 24 hours have passed and we can delete that subscription entry.

    :param sub_stripe: subscription object from Stripe
    """
    
    await subscription_service.delete_incomplete_subscription(db, sub_stripe["id"])
    return True
