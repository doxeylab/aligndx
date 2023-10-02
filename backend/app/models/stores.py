from enum import Enum


class BaseStores(Enum):
    SUBMISSION_DATA = "submission_data"
    UPLOADS = "uploads"
    RESULTS = "results"
    TEMP = "temp"
    DOWNLOADS = "downloads"
    PIPELINES = "pipelines"
