from typing import Dict
from uuid import UUID
from datetime import datetime
from app.models.base_schema import BaseSchema
from enum import Enum


class SubmissionStatus(Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"
    CLEANING_UP = "cleaning_up"
    FINISHED = "finished"


class FileStatus(Enum):
    REQUESTED = "requested"
    UPLOADING = "uploading"
    FINISHED = "finished"
    PAUSED = "paused"
    TERMINATED = "terminated"


class SubmissionRequest(BaseSchema):
    workflow_id: str
    name: str
    inputs: Dict[str, str]


class SubmissionResponse(BaseSchema):
    submission_id: str
    workflow_id: str
    name: str
    inputs: Dict[str, str]
    status: SubmissionStatus
    created_date: datetime
    finished_date: datetime = None


class SubmissionEntry(BaseSchema):
    id: UUID = None
    user_id: UUID
    status: SubmissionStatus
    created_date: datetime
    finished_date: datetime = None
