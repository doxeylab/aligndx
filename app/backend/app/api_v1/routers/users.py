# python libraries
from datetime import timedelta

# FastAPI
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status 
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

# auth components
import app.auth.auth_dependencies as auth
from app.auth.models import UserTemp, Token, User
from app.auth.auth_dependencies import get_current_user_no_exception
from app.auth.models import UserDTO

# db components
from app.db.models import Sample as ModelSample

# settings
from app.config.settings import get_settings

# config setup
app_settings = get_settings()
settings = app_settings.UserSettings()

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()
 
# Sign up endpoint
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def signup(user: UserTemp): 
    await auth.create_user(user)


# Log in endpoint
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm has username and password, username = email in our project
    user = await auth.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


# Check active user
@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user


# Get the submission results for the currently logged in user
@router.get('/submissions/')
async def get_standard_submissions(current_user: UserDTO = Depends(get_current_user_no_exception)):
    if current_user:
        submissions = await ModelSample.get_user_submissions(current_user.id)
        return submissions
    else:
        return {"message":"Unauthorized"}  
        

# -- Cookies attempt --


# Log in endpoint
# @router.post("/token", response_model=Token)
# async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
#     # OAuth2PasswordRequestForm has username and password, username = email in our project
#     user = await auth.authenticate_user(form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = auth.create_access_token(
#         data={"sub": user.email}, expires_delta=access_token_expires
#     )

#     content = {"message": "Come to the dark side, we have cookies"}
#     response = JSONResponse(content=content)
#     response.set_cookie(key="access_token", value=f'Bearer {access_token}', expires=access_token_expires, httponly=True)

#     return response
 
# from fastapi import Cookie
# @router.get("/users/me")
# async def read_users_me(cookie = Cookie(None)):
# return {"cookie": cookie}