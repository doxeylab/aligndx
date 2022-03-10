from uuid import UUID

from app.models.schemas import BaseSchema


class UserBase(BaseSchema):
    name: str
    email: str 
    hashed_password: str

class InUserSchema(UserBase):
    # can add validation logic here, if need be
    ...

class UserSchema(UserBase):
    id: UUID
 