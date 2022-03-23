# FastAPI
from fastapi import HTTPException, status

# Database Models & DAL
from app.db.dals.payments import CustomersDal
from app.models.schemas.payments.customers import UpdatePaymentMethod

# Services
from app.services import stripe_service

async def get_by_stripe_id(db, stripe_customer_id):
    customer_dal = CustomersDal(db)
    return await customer_dal.get_customer_by_stripe_id(stripe_customer_id)

async def get_client_secret(db, current_user):
    customer_dal = CustomersDal(db)
    customer_db = await customer_dal.get_customer_by_admin_id(current_user.id)

    if customer_db == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "Customer not found")
    if customer_db.admin_user_id != current_user.id:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "Only Admin can update payment method")

    setup_intent = await stripe_service.create_setup_intent(customer_db.stripe_customer_id)
    return setup_intent.client_secret

async def update_payment_method(db, customer_id, invoice):
    customers_dal = CustomersDal(db)
    update_items = UpdatePaymentMethod(
        payment_card_type = invoice["payment_intent"]["payment_method"]["card"]["brand"],
        card_last4 = invoice["payment_intent"]["payment_method"]["card"]["last4"],
        card_expiry = f'{invoice["payment_intent"]["payment_method"]["card"]["exp_month"]}/{invoice["payment_intent"]["payment_method"]["card"]["exp_year"]}',
        stripe_default_payment_method_id = invoice["payment_intent"]["payment_method"]["id"]
    )
    return await customers_dal.update(customer_id, update_items)

async def replace_payment_method(db, stripe_customer_id, payment_method_id):
    customer = await get_by_stripe_id(db, stripe_customer_id)
    if customer.stripe_default_payment_method_id != None:
        await stripe_service.delete_payment_method(customer.stripe_default_payment_method_id)

    await stripe_service.set_default_payment_method(customer.stripe_customer_id, payment_method_id)
    payment_method = await stripe_service.get_payment_method(payment_method_id)

    customers_dal = CustomersDal(db)
    update_items = UpdatePaymentMethod(
        payment_card_type = payment_method["card"]["brand"],
        card_last4 = payment_method["card"]["last4"],
        card_expiry = f'{payment_method["card"]["exp_month"]}/{payment_method["card"]["exp_year"]}',
        stripe_default_payment_method_id = payment_method["id"]
    )
    return await customers_dal.update(customer.id, update_items)