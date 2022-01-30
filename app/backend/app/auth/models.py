from typing import Optional
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Base model user information the frontend needs
class User(BaseModel):
    email: str
    name: str


# Inherited model - used for when user makes a request to create an account
class UserTemp(User):
    password: str


# Inherited model - used to store the user in the DB
class UserInDB(User):
    hashed_password: str


# User DTO
class UserDTO(BaseModel):
    id: int
    email: str
    name: str
