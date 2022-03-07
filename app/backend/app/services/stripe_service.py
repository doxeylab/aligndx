import os
import stripe
from app.db.payments.schemas import CustomerDTO
from fastapi import HTTPException, status

stripe.api_key = os.getenv("STRIPE_KEY")
stripe.max_network_retries = 3
# stripe.api_key = "sk_test_pRfLsfCsTQN3q1gcwE1mcIMW00d4qmXzi"

async def create_customer(customer: CustomerDTO):
    try:
        resp = stripe.Customer.create(
            email = customer.email,
            name = customer.name,
            metadata = {
                "AlignDx_CustomerID": customer.id
            }
        )
        return resp

    except:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Can't create Customer - Stripe service down.")