from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.users import Users

from sqlalchemy import select

class UsersDal(BaseDal[Users]):
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
        return query