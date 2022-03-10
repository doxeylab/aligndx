from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.users import Users
from app.models.schemas.users import InUserSchema, UserSchema

class UsersDal(BaseDal[InUserSchema, UserSchema, Users]):
    @property
    def _in_schema(self) -> Type[InUserSchema]:
        return InUserSchema

    @property
    def _schema(self) -> Type[UserSchema]:
        return UserSchema

    @property
    def _table(self) -> Type[Users]:
        return Users