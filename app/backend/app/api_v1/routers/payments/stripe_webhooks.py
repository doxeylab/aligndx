# FastAPI
from fastapi import APIRouter, Request, Header, HTTPException, Response, Depends, status

# Services
from app.services import stripe_webhook_service as service
from app.services.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession

# os
import os
from typing import Optional

# Stripe
import stripe
from stripe.error import StripeError

webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

router = APIRouter()

# Stripe Webhooks - POST: /webhooks/stripe
@router.post("")
async def stripe_events(
        req: Request,
        resp: Response,
        Stripe_Signature: Optional[str] = Header(None),
        db: AsyncSession = Depends(get_db)
    ):
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
    if event and event['type'] == 'invoice.paid':
        result = await service.handle_invoice_paid(await req.json(), db)
    
    if event and event['type'] == 'setup_intent.succeeded':
        result = await service.handle_payment_method(await req.json(), db)
    
    if event and event['type'] == 'customer.subscription.deleted':
        result = await service.handle_cancellation(await req.json(), db)

    if result:
        return
    else:
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return