from enum import Enum
from .local_storage import LocalStorage
from .object_storage import ObjectStorage
from app.core.config.settings import settings


class StorageType(Enum):
    LOCAL = "local"
    OBJECT = "object"


class StorageManager:
    def __init__(self, sub_id):
        self.sub_id = sub_id
        self.stores = {}
        self.base_stores = settings.BASE_STORES

        storage_type = StorageType(settings.STORAGE_TYPE.lower())

        for store, base_store in self.base_stores.items():
            if storage_type == StorageType.LOCAL:
                self.stores[store] = LocalStorage(directory=f"{base_store}/{sub_id}")
            elif storage_type == StorageType.OBJECT:
                self.stores[store] = ObjectStorage(
                    bucket=f"{base_store}", sub_id=sub_id
                )
            else:
                raise ValueError(f"Invalid STORAGE_TYPE in settings: {storage_type}")

    def read(self, store, filename):
        return self.stores[store].read(filename)

    def write(self, store, filename, content):
        self.stores[store].write(filename, content)

    def move(self, source_store, destination_store, filename):
        source = self.stores[source_store]
        destination = self.stores[destination_store]

        content = source.read(filename)
        destination.write(filename, content)
        source.delete(filename)

    def delete(self, store, filename):
        self.stores[store].delete(filename)

    def delete_all(self, store):
        self.stores[store].delete_all()
