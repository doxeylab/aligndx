from enum import Enum


class BaseStores(Enum):
    UPLOADS = "uploads"
    SUBMISSIONS = "submissions"
    RESULTS = "results"
    WORFKLOWS = "workflows"


class StorageTypes(Enum):
    LOCAL = "local"
    OBJECT = "object"
