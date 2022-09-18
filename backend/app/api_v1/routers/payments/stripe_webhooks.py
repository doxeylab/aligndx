# FastAPI
from fastapi import APIRouter, Request, Header, HTTPException, Response, Depends, status

# Settings
from app.config.settings import settings

# Services
from app.services import stripe_webhook_service as service
from app.services.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession

# Stripe
import stripe
from stripe.error import StripeError

from typing import Optional

webhook_secret = settings.stripe_webhook_secret

router = APIRouter()

# Stripe Webhooks - POST: /webhooks/stripe
@router.post("")
async def stripe_events(
        req: Request,
        resp: Response,
        Stripe_Signature: Optional[str] = Header(None),
        db: AsyncSession = Depends(get_db)
    ):
    """
    Stripe Webhooks: All these API calls are invoked by Stripe

    Stripe sends out events that we registered with them to send us.
    For example: Upon a successful payment Stripe will send out an
    'invoice.paid' event with the Invoice object as the payload.
    """

    payload = await req.body()
    try:
        # verify request originated from Stripe
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=Stripe_Signature, secret=webhook_secret
        )
        
    except StripeError as error:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = f"Stripe Error :{error}")

    # Handle Events
    result = None
    # Handle invoice.paid Event
    if event and event['type'] == 'invoice.paid':
        result = await service.handle_invoice_pmt_succeeded(db, await req.json())
    
    # Handle customer.subscription.updated Event
    if event and event['type'] == 'customer.subscription.updated':
        payload = await req.json()
        subscription = payload["data"]["object"]

        # Handle subscription status = "past_due"
        if subscription['status'] == "past_due":
            result = await service.handle_failed_payment(db, subscription)
        
        # Handle subscription status = "incomplete_expired"
        if subscription['status'] == "incomplete_expired":
            result = await service.handle_incomplete_subs(db, subscription)
            
        else:
            result = True
    
    if event and event['type'] == 'setup_intent.succeeded':
        result = await service.handle_payment_method(await req.json(), db)
    
    if event and event['type'] == 'customer.subscription.deleted':
        result = await service.handle_cancellation(await req.json(), db)

    if result:
        resp.status_code = status.HTTP_200_OK
        return
    else:
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return