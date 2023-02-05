from datetime import timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, Response, Cookie, Request, Body
from fastapi import HTTPException, status 
from fastapi.security import OAuth2PasswordRequestForm

import app.auth.auth_dependencies as auth
from app.auth.models import UserTemp, Token, User
from app.services.db import get_db 

from app.config.settings import settings

router = APIRouter()

# Sign up endpoint
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def signup(user: UserTemp, db: AsyncSession = Depends(get_db)): 
    res = await auth.create_user(user, db)
    return res

# Log in endpoint
@router.post("/token", response_model=Token)
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # OAuth2PasswordRequestForm has username and password, username = email in our project
    user = await auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.is_admin:
        role = 'customer'
    else:
        role = 'user'
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_token(
        data={"sub": user.email, "rol": role, "usr": user.name}, expires_delta=access_token_expires
    )

    refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    refresh_token = auth.create_token(
        data={"sub": user.email, "rol": role, "usr": user.name}, expires_delta=refresh_token_expires
    )

    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True)
    return {"access_token": access_token, 
            "token_type": "bearer"}

@router.get("/logout", status_code=200)
async def logout(response : Response):
    # used to destroy refresh cookie
    response.delete_cookie(key ='refresh_token')
    return {'msg':'logout was successful'}

@router.get("/refresh")
async def refresh(refresh_token: str = Cookie(None),  db: AsyncSession = Depends(get_db)):
    if refresh_token:
        result = await auth.verify_refresh_token(refresh_token, db)
        if not result:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = auth.create_token(
            data=result, expires_delta=access_token_expires
        )
        return {"access_token": new_access_token}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No cookie set",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Check active user
@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user
