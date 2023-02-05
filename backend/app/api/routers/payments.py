# FastAPI
from typing import Union
from fastapi import APIRouter, Depends, status, HTTPException

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

# Payments Schemas
from app.models.schemas.payments.subscriptions import CreateSubscriptionRequest, ChangePlanRequest, SubscriptionDTO
from app.models.schemas.payments.plans import AllPlansResponse

# Services
from app.services import subscription_service, plans_service, settings_page_service
from app.services.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.services.payments import customer_service

router = APIRouter()

# Create new subscription: POST /payments/subscriptions
@router.post("/subscriptions", status_code=status.HTTP_201_CREATED)
async def create_subscription(
        request: CreateSubscriptionRequest,
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ):
    """
    Endpoint to create an incomplete subscription
    :param request: contains the plan id for subscription
    """
    res = await subscription_service.create_subscription(current_user, request, db)
    return {"client_secret": res}

# Get active subscription: GET /payments/subscriptions
@router.get("/subscriptions", response_model=Union[SubscriptionDTO, None])
async def get_active_subscription(
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ):
    """
    Endpoint to retrieve an active subscription for the current user.
    """
    return await subscription_service.get_active_subscription(db, current_user)
# Get a client secret to render Payment Element
@router.get("/update-card/secret")
async def payment_card_secret(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    User requests to update their payment method details.
    Returns: client secret used to render Stripe payment elements.
    """
    res = await customer_service.get_client_secret(db, current_user)
    return {"client_secret": res}

# Cancel Subscription - DELETE /payments/subscriptions
@router.delete("/subscriptions")
async def cancel_subscription(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Current user requests to cancel subscription at the end of current period.
    """
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Admin access required.")

    res = await subscription_service.request_cancellation(db, current_user)
    return {"response": res}

# Reactivate Subscription - PUT /payments/subscriptions
@router.put("/subscriptions")
async def reactivate_subscription(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Current user wants to undo an existing cancellation request.
    """
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Admin access required.")

    res = await subscription_service.reactivate_subscription(db, current_user)
    return {"response": res}

# Upgrade/downgrade subscription: PUT /payments/subscriptions/change-plan
@router.put("/subscriptions/change-plan", status_code=status.HTTP_200_OK)
async def change_plan(
        request: ChangePlanRequest,
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Current user requests to change their current plan.
        
    Plan downgrades are processed at the end of current period while upgrades
    are processed immediately. 
    :param request: id of the new plan that the curent user wants to replace with.
    """
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN, detail = "Admin access required.")
    
    res = await subscription_service.change_plan(db, current_user, request)
    return {"response": res}

# Cancel downgrade subscription: DELETE /payments/subscriptions/change-plan
@router.delete("/subscriptions/change-plan", status_code=status.HTTP_200_OK)
async def cancel_downgrade(
        current_user: UserDTO = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
):
    """
    Current user wants to cancel an existing request to downgrade to a lower cost plan.
    """
    if current_user.is_admin == False:
        raise HTTPException(status_code = status.HTTP_403_FORBIDDEN,
                        detail = "Admin access required.")
    
    res = await subscription_service.cancel_downgrade(db, current_user)
    return {"response": res}

# GET: /payments/plans
@router.get("/plans", response_model=AllPlansResponse)
async def get_plans(db: AsyncSession = Depends(get_db)):
    """
    Returns all available plans offered at this time.
    """
    res = await plans_service.get_all_plans(db)
    return {"plans": res}

# Settings Page Endpoint: GET /payments/settings
@router.get("/settings")
async def settings_page(
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns data required for settings page.
    """
    if current_user.is_admin:
        res = await settings_page_service.get_admin_settings(db, current_user)
    else:
        res = await settings_page_service.get_non_admin_settings(db, current_user)
    return res