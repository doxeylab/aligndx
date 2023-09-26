from enum import Enum


class BaseStores(Enum):
    UPLOADS = "uploads"
    SUBMISSIONS = "submissions"
    RESULTS = "results"


class StorageTypes(Enum):
    LOCAL = "local"
    OBJECT = "object"
