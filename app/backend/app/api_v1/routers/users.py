# python libraries
from datetime import timedelta

# FastAPI
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status 
from fastapi.security import OAuth2PasswordRequestForm

# auth components
import app.auth.auth_dependencies as auth
from app.auth.models import UserTemp, Token, User
from app.auth.auth_dependencies import get_current_user
from app.auth.models import UserDTO, RefreshRequest

# db components
from app.db.dals.users import UsersDal
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

# settings
from app.config.settings import settings

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

# Sign up endpoint
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def signup(user: UserTemp, db: AsyncSession = Depends(get_db)): 
    res = await auth.create_user(user, db)
    return res

# Log in endpoint
@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(),  db: AsyncSession = Depends(get_db)):
    # OAuth2PasswordRequestForm has username and password, username = email in our project
    user = await auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "is_admin": user.is_admin}, expires_delta=access_token_expires
    )
    refresh_token = auth.create_refresh_token(user.email, user.is_admin)

    return {"access_token": access_token, 
            "refresh_token": refresh_token, 
            "token_type": "bearer"}


@router.post("/refresh")
async def refresh(request: RefreshRequest):
    result = await auth.verify_refresh_token(request)
    if not result:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = auth.create_access_token(
        data={"sub": result}, expires_delta=access_token_expires
    )
    return {"access_token": new_access_token}


# Check active user
@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user


# Get the submission results for the currently logged in user
@router.get('/submissions/')
async def get_standard_submissions(current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    users_dal = UsersDal(db) 
    submissions = await users_dal.get_all_submissions(current_user.id)
    return submissions
        

@router.get('/incomplete/')
async def get_incomplete_submissions(current_user: UserDTO = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    users_dal = UsersDal(db) 
    submissions = await users_dal.get_incomplete_submissions(current_user.id)
    return submissions

# returns single result for UI to access when user clicks on a linked result
@router.get('/linked_results/{file_id}')
async def get_result(file_id: str, current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    users_dal = UsersDal(db) 
    query = await users_dal.get_submission(current_user.id, file_id)
    
    if (not query):
        return HTTPException(status_code=404, detail="Item not found")
    
    data = query.result

    return data