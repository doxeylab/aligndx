from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.users import Users
from app.models.schemas.users import InUserSchema, UserSchema

from sqlalchemy import select

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
    
    @classmethod
    async def get_user_submission(self, userid, fileid) -> Type[Users]:
        '''
        returns fileid if it exists under the users relationship
        '''
        statement = (select(self._table)
                    .where(self._table.c.id == userid,
                          self._table.c.submission_id == fileid)
                    )
        
        query = await self._db_session.execute(statement)
        await self._db_session.commit()
        return self._schema.from_orm(query)