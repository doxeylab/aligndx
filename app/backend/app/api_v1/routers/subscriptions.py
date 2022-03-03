# FastAPI
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

router = APIRouter()

# Create new subscription: POST /subscriptions
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_subscription(current_user: UserDTO = Depends(get_current_user)): 
    # res = await auth.create_user(user)
    return {"result": "ok"}