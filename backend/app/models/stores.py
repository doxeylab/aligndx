from enum import Enum


class BaseStores(Enum):
    UPLOADS = "uploads"
    SUBMISSIONS = "submissions"
    RESULTS = "results"
    WORKFLOWS = "workflows"
    CACHE = "cache"


class StorageTypes(Enum):
    LOCAL = "local"
    OBJECT = "object"
