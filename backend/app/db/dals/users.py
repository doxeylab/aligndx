from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.users import Users
from app.db.tables.submissions import Submissions

from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload

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

    async def get_submission(self, user_id: UUID, sub_id: UUID):
        '''
        returns specific file by id, under users submissions
        '''
        stmt =  (
            select(self._table)
                .where(self._table.id == user_id)
                .options(joinedload(self._table.submissions.and_(Submissions.id==sub_id)))
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().first()
        return result.submissions[0]
        
    async def get_all_submissions(self, user_id: UUID):
        '''
        returns all submissions for a user
        '''
        stmt =  (
            select(self._table)
                .where(self._table.id == user_id)
                .options(joinedload(self._table.submissions))
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().first()
        return result.submissions

    async def get_incomplete_submissions(self, user_id: UUID):
        '''
        returns incomplete submissions for a user
        '''
        stmt =  (
            select(self._table)
                .where(self._table.id == user_id)
                .options(joinedload(self._table.submissions.and_(Submissions.finished_date == None)))
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().first()
        return result.submissions
    
    async def get_all_users_for_customer(self, customer_id: UUID):
        '''
        returns all users for a specific customer
        '''
        stmt = (select(self._table).where(self._table.customer_id == customer_id))
        query = await self._db_session.execute(stmt)
        return query.scalars()