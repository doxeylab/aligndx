from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.phi_logs import UploadLogs, DeletionLogs 

from sqlalchemy import select
#  -- UploadLogs DAL -- 

class UploadLogsDal(BaseDal[UploadLogs]):
    @property
    def _table(self) -> Type[UploadLogs]:
        return UploadLogs
    
    @classmethod
    async def get_uploads_in_range(self, submission_id, start_kilobyte, kilobyte_size):
        '''
        returns all upload logs for a particular submission within a defined range
        '''
        query = await self._db_session.execute(select(self._table)
                                               .where(self._table.c.submission_id == submission_id,
                                                    self._table.c.start_kilobytes > start_kilobyte,
                                                    self._table.c.start_kilobytes < start_kilobyte + kilobyte_size
                                                ))
        await self._db_session.commit()
        return query
#  -- DeletionLogs DAL -- 

class DeletionLogsDal(BaseDal[DeletionLogs]):
    @property
    def _table(self) -> Type[DeletionLogs]:
        return DeletionLogs  