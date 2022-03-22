from app.models.schemas.payments.subscriptions import SubscriptionSchema
from app.services import invoice_service, subscription_service, stripe_service

# Webhook: invoice.paid
async def handle_invoice_paid(req, db):
    # Extract the Stripe Subscription id from the Strip Invoice Object
    stripe_sub_id = req["data"]["object"]["subscription"]

    # Get subscription from db
    sub = await subscription_service.get_subscription_by_stripe_id(db, stripe_sub_id)
    sub_db = SubscriptionSchema.from_orm(sub)
    if sub_db == None: return False

    # Get Subscription object from Stripe incl. Invoice & Payment Intent
    sub_stripe = await stripe_service.get_subscription(
        stripe_sub_id,
        ["latest_invoice.payment_intent.payment_method"]
    )
    
    # Create Invoice in db
    await invoice_service.create_invoice(db, sub_stripe.latest_invoice, sub_db.id, sub_db.customer_id)

    # Update Subscription items in db
    await subscription_service.update_after_payment_success(db, sub_db.id, sub_stripe)

    return True