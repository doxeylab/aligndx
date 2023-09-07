from enum import Enum

class JobStatus(Enum):
    CREATED = "created"
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"
    CLEANING_UP = "cleaning_up"
    FINISHED = "finished"