from typing import Dict
from uuid import UUID
from datetime import datetime
from app.models.base_schema import BaseSchema
from enum import Enum


class SubmissionStatus(Enum):
    CREATED = "created"
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


class SubmissionMetadata(BaseSchema):
    submission_id: str
    workflow_id: str
    job_id: str
    name: str
    inputs: Dict[str, str]
    status: SubmissionStatus


class SubmissionResponse(SubmissionMetadata):
    created_date: datetime
    finished_date: datetime = None


class SubmissionEntry(BaseSchema):
    id: UUID = None
    user_id: UUID = None
    workflow_id: str = None
    status: SubmissionStatus = None
    created_date: datetime = None
    finished_date: datetime = None
