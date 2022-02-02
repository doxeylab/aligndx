from app.auth.models import TokenData, User, UserInDB, UserDTO, UserTemp
from app.db.models import User as UserRepo

from datetime import datetime, timedelta
from typing import Optional 

from fastapi import Depends, HTTPException, status 
from jose import JWTError, jwt

from app.config.settings import get_settings

# config
app_settings = get_settings()
settings = app_settings.AuthSettings()

oauth2_scheme_auto_error = settings.oauth2_scheme_auto_error
oauth2_scheme = settings.oauth2_scheme
pwd_context = settings.pwd_context

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

# Creates user if it exists 
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
    return {"status": status.HTTP_201_CREATED,
            "message": "User successfully created"}

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

    return UserDTO(**user)


# ws version
async def get_current_user_ws(token: str):
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

    return UserDTO(**user)