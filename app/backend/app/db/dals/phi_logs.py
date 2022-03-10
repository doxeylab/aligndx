from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.phi_logs import UploadLogs, DeletionLogs
from app.models.schemas.phi_logs import InUploadLogSchema, UploadLogSchema, InDeletionLogSchema, DeletionLogSchema

#  -- UploadLogs DAL -- 

class UploadLogsDal(BaseDal[InUploadLogSchema, UploadLogSchema, UploadLogs]):
    @property
    def _in_schema(self) -> Type[InUploadLogSchema]:
        return InUploadLogSchema

    @property
    def _schema(self) -> Type[UploadLogSchema]:
        return UploadLogSchema

    @property
    def _table(self) -> Type[UploadLogs]:
        return UploadLogs

#  -- DeletionLogs DAL -- 

class DeletionLogs(BaseDal[InDeletionLogSchema, DeletionLogSchema, DeletionLogs]):
    @property
    def _in_schema(self) -> Type[InDeletionLogSchema]:
        return InDeletionLogSchema

    @property
    def _schema(self) -> Type[DeletionLogSchema]:
        return DeletionLogSchema

    @property
    def _table(self) -> Type[DeletionLogs]:
        return DeletionLogs  