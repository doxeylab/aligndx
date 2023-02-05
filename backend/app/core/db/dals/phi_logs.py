from typing import Type

from .base_dal import BaseDal
from ..tables.phi_logs import UploadLogs, DeletionLogs 

from sqlalchemy import select
#  -- UploadLogs DAL -- 

class UploadLogsDal(BaseDal[UploadLogs]):
    @property
    def _table(self) -> Type[UploadLogs]:
        return UploadLogs
    
    async def get_uploads_in_range(self, submission_id, start_kilobyte, kilobyte_size):
        '''
        returns all upload logs for a particular submission within a defined range
        '''
        statement = (select(self._table)
                    .where(self._table.c.submission_id == submission_id,
                           self._table.c.start_kilobytes > start_kilobyte,
                           self._table.c.start_kilobytes < start_kilobyte + kilobyte_size
                    ))
        query = await self._db_session.execute(statement)
        # await self._db_session.commit()
        return query

#  -- DeletionLogs DAL -- 

class DeletionLogsDal(BaseDal[DeletionLogs]):
    @property
    def _table(self) -> Type[DeletionLogs]:
        return DeletionLogs  