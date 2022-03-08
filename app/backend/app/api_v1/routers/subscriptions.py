# FastAPI
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

# Payments Schemas
from app.db.payments.schemas import CreateSubscriptionRequest

# Services
from app.services import subscription_service

router = APIRouter()

# Create new subscription: POST /subscriptions
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_subscription(
        request: CreateSubscriptionRequest,
        current_user: UserDTO = Depends(get_current_user)
    ):
    res = await subscription_service.create_subscription(current_user, request)
    return {"client_secret": res}