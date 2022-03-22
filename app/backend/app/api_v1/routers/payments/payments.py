# FastAPI
from fastapi import APIRouter, Depends
from fastapi import status

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

# Payments Schemas
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest

# Services
from app.services import subscription_service
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