from .local_storage import LocalStorage
from .object_storage import ObjectStorage
from app.core.config.settings import settings
from app.models.stores import BaseStores, StorageTypes


class StorageManager:
    def __init__(self, prefix=None):
        self.stores = {}
        self.prefix = prefix

        storage_type = settings.STORAGE_TYPE

        for base_store in BaseStores:
            if storage_type == StorageTypes.LOCAL:
                self.stores[base_store.value] = LocalStorage(
                    store=settings.BASE_STORES[base_store], prefix=self.prefix
                )
            elif storage_type == StorageTypes.OBJECT:
                self.stores[base_store.value] = ObjectStorage(
                    store=settings.BASE_STORES[base_store], prefix=self.prefix
                )
            else:
                raise ValueError(f"Invalid STORAGE_TYPE in settings: {storage_type}")

    def get_path(self, store, filename):
        return self.stores[store].get_path(filename)

    def read(self, store, filename):
        return self.stores[store].read(filename)

    def write(self, store, filename, content):
        self.stores[store].write(filename, content)

    def delete(self, store, filename):
        self.stores[store].delete(filename)

    def delete_all(self, store):
        self.stores[store].delete_all()

    def move(self, src_store, src_filename, dest_filename, dest_store=None):
        if dest_store is None:
            self.stores[src_store].move_within_store(src_filename, dest_filename)
        else:
            src_storage = self.stores[src_store]
            dest_storage = self.stores[dest_store]

            src_storage.move_between_stores(dest_storage, src_filename, dest_filename)
