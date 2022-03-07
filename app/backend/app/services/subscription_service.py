# Models & Repos
from app.db.payments.repositories import CustomerRepo, SubscriptionRepo
from app.auth.models import UserDTO
from app.db.payments.schemas import CreateSubscriptionRequest

# Services
from app.services import stripe_service

# Utils
from datetime import datetime

async def create_subscription(current_user: UserDTO, req: CreateSubscriptionRequest):
    # Create customer in db
    new_customer = {
        "name": current_user.name,
        "email": current_user.email,
        "admin_user_id": current_user.id,
        "creation_time": datetime.now()
    }
    customer_id = await CustomerRepo.create_customer(**new_customer)
    customer = await CustomerRepo.get_customer_by_id(customer_id)

    # Create customer in Stripe & update db
    stripe_customer = await stripe_service.create_customer(customer)
    await CustomerRepo.update_customer(customer_id, stripe_customer.id)

    # Create subscription in db

    # Create subscription in Stripe & update db
    return customer_id