from uuid import UUID
from datetime import datetime

from .base_schema import BaseSchema

#  -- Upload Schemas -- 

class UploadLogBase(BaseSchema):
    submission_id : UUID 
    start_kilobytes : int 
    size_kilobytes : int 
    creation_time : datetime 

class InUploadLogSchema(UploadLogBase):
    # can add validation logic here, if need be
    ...

class UploadLogSchema(UploadLogBase):
    id: UUID
 
#  -- Deletion Schemas -- 

class DeletionLogBase(BaseSchema):
    upload_id : int
    deletion_time : datetime 
    ...

class InDeletionLogSchema(DeletionLogBase):
    # can add validation logic here, if need be
    ...

class DeletionLogSchema(DeletionLogBase):
    id: UUID