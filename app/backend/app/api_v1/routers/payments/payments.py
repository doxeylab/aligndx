# FastAPI
from fastapi import APIRouter, Depends, status, HTTPException

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

# Payments Schemas
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, ChangeSubscriptionRequest

# Services
from app.services import subscription_service, customer_service
from app.services.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# Create new subscription: POST /payments/subscriptions
@router.post("/subscriptions", status_code=status.HTTP_201_CREATED)
async def create_subscription(
        request: CreateSubscriptionRequest,
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ):
    res = await subscription_service.create_subscription(current_user, request, db)
    return {"client_secret": res}

# Get a client secret to render Payment Element
@router.get("/update-card/secret")
async def payment_card_secret(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await customer_service.get_client_secret(db, current_user)
    return {"client_secret": res}

# Cancel Subscription - DELETE /payments/subscriptions
@router.delete("/subscriptions")
async def cancel_subscription(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,
                        detail = "Only Admin can cancel subscription")

    res = await subscription_service.request_cancellation(db, current_user)
    return {"response": res}

# Upgrade/downgrade subscription: PUT /payments/subscriptions/change-plan
@router.put("/subscriptions/change-plan", status_code=status.HTTP_200_OK)
async def create_subscription(
        request: CreateSubscriptionRequest,
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,
                        detail = "Only Admin can change subscription plan")
    
    res = await subscription_service.change_plan(db, current_user, request)
    return {"response": res}
