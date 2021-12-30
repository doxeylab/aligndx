from datetime import datetime, timedelta
from typing import Optional
import os

from app.db.models import User as UserRepo
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme_auto_error = OAuth2PasswordBearer(tokenUrl="token")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---- MODELS ----


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Base model user information the frontend needs
class User(BaseModel):
    id: int
    email: str
    name: str


# Inherited model - used for when user makes a request to create an account
class UserTemp(User):
    password: str


# Inherited model - used to store the user in the DB
class UserInDB(User):
    hashed_password: str


# ---- METHODS ----


# ---- USER AUTHENTICATION ----

# Returns the current logged in user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await UserRepo.get(token_data.email)
    if user is None:
        raise credentials_exception
    return user


# Authenticate the user: verify user exists and password is correct
async def authenticate_user(email: str, password: str):
    # Verify that the password is the correct password
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    user_res = await UserRepo.get(email)

    if not user_res:
        return False

    user = UserInDB(**user_res)
    if not verify_password(password, user.hashed_password):
        return False
    return User(**user_res)


# Returns the generated access token after user has been authenticated
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Sign up endpoint
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserTemp):
    user_from_db = await UserRepo.get(user.email)

    if user_from_db:
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
    await UserRepo.create(db_user)
    return {"status": status.HTTP_201_CREATED}


# Log in endpoint
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm has username and password, username = email in our project
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Returns the current logged in user if any, raises unauthorized error otherwise
async def get_current_user(token: str = Depends(oauth2_scheme_auto_error)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = await UserRepo.get(token_data.email)
    if user is None:
        raise credentials_exception

    return user


# Returns the current logged in user if any, returns None otherwise
async def get_current_user_no_exception(token: str = Depends(oauth2_scheme)):
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

    user = await UserRepo.get(token_data.email)
    if user is None:
        return None

    return User(**user)


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
