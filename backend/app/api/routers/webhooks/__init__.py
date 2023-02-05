from fastapi import APIRouter, Depends
from app.services.auth.auth_dependencies import get_current_user, ValidateService
from . import celery, tus, stripe

router = APIRouter()

router.include_router(
    celery.router,
    prefix="/celery",
    dependencies=[Depends(ValidateService("celery"))]
)

router.include_router(
    tus.router,
    prefix="/tus",
    dependencies=[Depends(get_current_user)]
)

router.include_router(
    stripe.router,
    prefix="/stripe",
    dependencies=[Depends(get_current_user)]
)
