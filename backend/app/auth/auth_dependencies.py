from base64 import encode
from app.models.schemas.users import UserPassword, UserSchema, UserDTO, UserTemp, UserInDB, RefreshRequest, TokenData, User
from app.db.dals.users import UsersDal  
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from datetime import datetime, timedelta
from typing import Optional 

from fastapi import Depends, HTTPException, status, Header
from jose import JWTError, ExpiredSignatureError, jwt

from app.config.settings import settings

oauth2_scheme_auto_error = settings.oauth2_scheme_auto_error
oauth2_scheme = settings.oauth2_scheme
pwd_context = settings.pwd_context

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

REFRESH_TOKEN_EXPIRE_MINUTES = settings.REFRESH_TOKEN_EXPIRE_MINUTES
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

credentials_expiry_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Expired",
    headers={"WWW-Authenticate": "Bearer"},
)


async def valid_email_from_db(email: str, db):
    user_dal = UsersDal(db)
    user_res = await user_dal.get_by_email(email)
    if user_res is None:
        return False
    return True


# Creates user if it doesn't exist 
async def create_user(user: UserTemp, db):
    if await valid_email_from_db(user.email, db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already exists, please log in.",
        )

    hashed_password = pwd_context.hash(user.password)
    db_user = UserInDB(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
    )
    user_dal = UsersDal(db)
    user_res = await user_dal.create(db_user)
    return {"status": status.HTTP_201_CREATED,
            "message": "User successfully created"}


# Authenticate the user: verify user exists and password is correct
async def authenticate_user(email: str, password: str, db):
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    user_dal = UsersDal(db)
    user_res = await user_dal.get_by_email(email)
    if user_res is None:
        return False
    
    user = UserSchema.from_orm(user_res)

    if not verify_password(password, user.hashed_password):
        return False

    return User(email=user.email, name=user.name, is_admin=user.is_admin)

# Returns a token, with expiry depending on token type
def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(claims=to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Verify refresh token is valid
async def verify_refresh_token(refresh_token, db): 
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        if not await valid_email_from_db(email, db):
            raise credentials_exception

    except ExpiredSignatureError:
        raise credentials_expiry_exception
    except JWTError:
        raise credentials_exception

    return payload


# Returns the current logged in user if any, raises unauthorized error otherwise
async def get_current_user(token: str = Depends(oauth2_scheme_auto_error), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except ExpiredSignatureError:
        raise credentials_expiry_exception
    except JWTError:
        raise credentials_exception

    user_dal = UsersDal(db)
    user_res = await user_dal.get_by_email(token_data.email)
    if user_res is None:
        raise credentials_exception
    
    user = UserSchema.from_orm(user_res)

    return UserDTO(
        id=user.id, 
        name=user.name, 
        email=user.email, 
        customer_id=user.customer_id,
        is_admin=user.is_admin
    )


# ws version
async def get_current_user_ws(token: str, db):
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        token_data = TokenData(email=email)
    except JWTError:
        return None

    user_dal = UsersDal(db)
    user_res = await user_dal.get_by_email(token_data.email)
    if user_res is None:
        raise credentials_exception
    
    user = UserSchema.from_orm(user_res)

    return UserDTO(
        id=user.id, 
        name=user.name, 
        email=user.email, 
        customer_id=user.customer_id,
        is_admin=user.is_admin
    )


class ValidateService:
    """
    Validates that request comes from an authenticated service
    """
    def __init__(self, service: str):
        self.service = service
    def __call__(self, api_key: str = Depends(oauth2_scheme_auto_error)):
        services = settings.SERVICES
        service_key = services.get(self.service)

        if api_key != service_key:
            raise credentials_exception
    