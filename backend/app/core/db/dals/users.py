from typing import Type

from .base_dal import BaseDal
from ..tables.users import Users

from sqlalchemy import select

from uuid import UUID
class UsersDal(BaseDal[Users]):
    @property
    def _table(self) -> Type[Users]:
        return Users

    async def get_by_email(self, email):
        '''
        returns user if email exists
        '''
        stmt = (select(self._table).where(self._table.email == email))
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
    async def get_all_users_for_customer(self, customer_id: UUID):
        '''
        returns all users for a specific customer
        '''
        stmt = (select(self._table).where(self._table.customer_id == customer_id))
        query = await self._db_session.execute(stmt)
        return query.scalars()