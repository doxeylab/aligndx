from typing import Type, List
from uuid import UUID

from .base_dal import BaseDal
from ..tables.submissions import Submissions

from sqlalchemy import select


class SubmissionsDal(BaseDal[Submissions]):
    @property
    def _table(self) -> Type[Submissions]:
        return Submissions

    async def get_submission(self, user_id: UUID, sub_id: UUID):
        """
        returns specific file by id, under users submissions
        """
        stmt = select(self._table).where(
            self._table.user_id == user_id, self._table.id == sub_id
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().first()
        return result

    async def get_submissions(self, user_id: UUID, sub_ids: List[UUID]):
        """
        returns query submissions for a user, if they exist
        """
        stmt = select(self._table).where(
            self._table.user_id == user_id, self._table.id.in_(sub_ids)
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().all()
        return result

    async def get_all_submissions(self, user_id: UUID):
        """
        returns all submissions for a user
        """
        stmt = select(self._table).where(self._table.user_id == user_id)
        query = await self._db_session.execute(stmt)
        result = query.scalars().all()
        return result

    async def get_incomplete_submissions(self, user_id: UUID):
        """
        returns incomplete submissions for a user
        """
        stmt = select(self._table).where(
            self._table.user_id == user_id, self._table.finished_date == None
        )
        query = await self._db_session.execute(stmt)
        result = query.scalars().first()
        return result.submissions
