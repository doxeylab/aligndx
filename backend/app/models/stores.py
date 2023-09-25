from enum import Enum


class BaseStores(Enum):
    UPLOADS = "uploads"
    RESULTS = "results"


class StorageType(Enum):
    LOCAL = "local"
    OBJECT = "object"
