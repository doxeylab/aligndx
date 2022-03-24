from uuid import UUID

from app.models.schemas.base_schema import BaseSchema
from typing import Optional

class UserBase(BaseSchema):
    name: str
    email: str 
    hashed_password: str
    customer_id: Optional[UUID]
    is_admin: bool

class UserSchema(UserBase):
    id: UUID
 
class UserPassword(BaseSchema):
    hashed_password: str

# User DTO
class UserDTO(BaseSchema):
    id: UUID
    email: str
    name: str
    customer_id: Optional[UUID]
    is_admin: bool
 
class Token(BaseSchema):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseSchema):
    email: Optional[str] = None

class RefreshRequest(BaseSchema):
    grant_type: str
    refresh_token: str

# Base model user information the frontend needs
class User(BaseSchema):
    email: str
    name: str
    is_admin: bool

# Inherited model - used for when user makes a request to create an account
class UserTemp(User):
    password: str

# Inherited model - used to store the user in the DB
class UserInDB(User):
    hashed_password: str
    customer_id: Optional[UUID]
    is_admin: bool = False

class SetAdminUpdateItems(BaseSchema):
    customer_id: UUID
    is_admin: bool
