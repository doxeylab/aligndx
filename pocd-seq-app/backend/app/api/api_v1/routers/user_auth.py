from datetime import datetime, timedelta
from typing import Optional

from app.db.models import User as UserRepo
from fastapi import Depends, HTTPException, APIRouter, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "07d6e91a7e61adcc965da5a176e376c0d0cf36ddce3c85f8e79429243bf13326"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---- MODELS ----

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: str
    name: str


class UserTemp(User):
    password: str


class UserInDB(User):
    hashed_password: str


# ---- METHODS ----

# Returns the current logged in user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await UserRepo.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user


# Authenticate the user: verify user exists and password is correct
async def authenticate_user(username: str, password: str):
    # Verify that the password is the correct password
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    user_res = await UserRepo.get(username)
    if not user_res:
        return False

    user = UserInDB(**user_res)
    if not verify_password(password, user.hashed_password):
        return False
    return user


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


@router.post("/create_user")
async def create_user(user: UserTemp):
    hashed_password = pwd_context.hash(user.password)
    db_user = UserInDB(username=user.username, email=user.email, name=user.name,
                       hashed_password=hashed_password)
    await UserRepo.create(db_user)
    return User(username=db_user.username, email=db_user.email,
                name=db_user.name)


@router.post("/token", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
