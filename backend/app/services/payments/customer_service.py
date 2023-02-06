# FastAPI
from fastapi import HTTPException, status

# Database Models & DAL
from app.core.db.dals.payments import CustomersDal
from app.core.db.dals.users import UsersDal
from app.models.users import SetAdminUpdateItems
from app.models.payments.customers import NewCustomer, UpdatePaymentMethod, UpdateCustomerStripeId

# Services
from app.services.payments import stripe_service

# Utils
from datetime import datetime

async def create_customer(db, current_user):
    """
    This method creates a new Customer object within our db and with Stripe. Also
    update our database with Stripe Customer Id.
    The current user is set as the Admin as well.

    Stripe Docs: https://stripe.com/docs/api/customers/object
    """
    new_customer = NewCustomer(
        name = current_user.name,
        email = current_user.email,
        creation_time = datetime.now()
    )

    customer_dal = CustomersDal(db)
    customer_id = await customer_dal.create(new_customer)

    # Set current user as admin
    users_dal = UsersDal(db)
    update_user = SetAdminUpdateItems(
        customer_id = customer_id,
        is_admin = True
    )
    await users_dal.update(current_user.id, update_user)

    # Create customer in Stripe & update db
    stripe_customer = await stripe_service.create_customer(customer_id, current_user.name, current_user.email)
    update_items = UpdateCustomerStripeId(
        stripe_customer_id = stripe_customer.id
    )
    await customer_dal.update(customer_id, update_items)
    
    return customer_id

async def get_by_id(db, customer_id):
    """
    This method returns the Customer object

    :param customer_id: id (UUID) of the customer object requested
    """
    customer_dal = CustomersDal(db)
    return await customer_dal.get_by_id(customer_id)

async def get_by_stripe_id(db, stripe_customer_id):
    """
    This method returns the Customer object which matches the Stripe Customer Id

    :param stripe_customer_id: Stripe's customer Id of the customer object requested
    """
    customer_dal = CustomersDal(db)
    return await customer_dal.get_customer_by_stripe_id(stripe_customer_id)

async def get_client_secret(db, current_user):
    """
    This method returns the client secret required to render the Stripe 
    payment element to update the payment method.
    front-end --> Settings Page --> Update Payment Method

    The client secret is part of Stripe's Setup Intent object
    Stripe Docs: https://stripe.com/docs/api/setup_intents/object
    """
    customer_dal = CustomersDal(db)
    customer_db = await customer_dal.get_by_id(current_user.customer_id)

    if customer_db == None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                        detail = "Customer not found")
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "Only Admin can update payment method")

    setup_intent = await stripe_service.create_setup_intent(customer_db)
    return setup_intent.client_secret

async def set_payment_method(db, customer_id, invoice, stripe_customer_id):
    """
    This method updates the customer's payment method details in the
    customers table sets it as the default payment method in Stripe
    so all future invoices are paid with this card.
    This method is invoked only via Stripe Webhook upon first successful payment for
    a new subscription.

    :param customer_id: id (UUID) of the customer object requested
    :param invoice: Stripe's Invoice Object
    :param stripe_customer_id: Stripe's customer Id of the customer

    Stripe Docs: https://stripe.com/docs/api/invoices/object
    """
    payment_method_id = invoice["payment_intent"]["payment_method"]["id"]

    customers_dal = CustomersDal(db)
    update_items = UpdatePaymentMethod(
        payment_card_type = invoice["payment_intent"]["payment_method"]["card"]["brand"],
        card_last4 = invoice["payment_intent"]["payment_method"]["card"]["last4"],
        card_expiry = f'{invoice["payment_intent"]["payment_method"]["card"]["exp_month"]}/{invoice["payment_intent"]["payment_method"]["card"]["exp_year"]}',
        stripe_default_payment_method_id = payment_method_id
    )
    
    # Set this card as default for the customer in Stripe
    await stripe_service.set_default_payment_method(stripe_customer_id, payment_method_id)
    
    return await customers_dal.update(customer_id, update_items)

async def replace_payment_method(db, stripe_customer_id, payment_method_id):
    """
    This method replaces the customer's existings payment method
    with a new payment method.
    It is only triggered via Stripe Webhook upon successfully
    update of payment method in front-end settings page.

    :param payment_method_id: Stripe's Payment Method Object's Id
    :param stripe_customer_id: Stripe's customer Id of the customer

    Stripe Docs: https://stripe.com/docs/api/payment_methods/object
    """
    customer = await get_by_stripe_id(db, stripe_customer_id)

    if customer == None:
        raise HTTPException(status_code = 400, detail = "Customer not found in db.")

    if customer.stripe_default_payment_method_id != None:
        # Delete existing payment method, if exists
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

async def delete_payment_method(db, customer_id):
    """
    This method deletes the customer's payment method from db
    and from Stripe as well.
    It is only triggered via Stripe Webhook and is part of
    subscription cancellation process.

    :param payment_method_id: Stripe's Payment Method Object's Id
    :param customer_id: Id of the customer object in our db
    """
    customers_dal = CustomersDal(db)
    customer = await customers_dal.get_by_id(customer_id)

    if customer.stripe_default_payment_method_id != None:
        await stripe_service.delete_payment_method(customer.stripe_default_payment_method_id)
    
    update_items = UpdatePaymentMethod(
        payment_card_type = None,
        card_last4 = None,
        card_expiry = None,
        stripe_default_payment_method_id = None
    )
    return await customers_dal.update(customer.id, update_items)
