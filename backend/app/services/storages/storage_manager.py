from typing import Union
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
                self.stores[base_store] = LocalStorage(
                    store=settings.BASE_STORES[base_store], prefix=self.prefix
                )
            elif storage_type == StorageTypes.OBJECT:
                self.stores[base_store] = ObjectStorage(
                    store=settings.BASE_STORES[base_store], prefix=self.prefix
                )
            else:
                raise ValueError(f"Invalid STORAGE_TYPE in settings: {storage_type}")


    def get_path(self, store: BaseStores, filename: str, prefix_path=False):
        return self.stores[store].get_path(filename, prefix_path)

    def read(self, store: BaseStores, filename: str):
        return self.stores[store].read(filename)

    def write(self, store: BaseStores, filename: str, content):
        self.stores[store].write(filename, content)

    def delete(self, store: BaseStores, filename: str):
        self.stores[store].delete(filename)

    def delete_all(self, store: BaseStores):
        self.stores[store].delete_all()

    def move(
        self,
        src_store: BaseStores,
        src_filename,
        dest_filename,
        dest_store: Union[BaseStores, None] = None,
    ):
        if dest_store is None:
            self.stores[src_store].move_within_store(src_filename, dest_filename)
        else:
            src_storage = self.stores[src_store]
            dest_storage = self.stores[dest_store]

            src_storage.move_between_stores(dest_storage, src_filename, dest_filename)

    def list_folders(self, store: BaseStores):
        return self.stores[store].list_folders()

    def exists(self, store: BaseStores, key: str):
        return self.stores[store].exists(key)

    def download_and_store(self, store: BaseStores, url: str, key: str):
        self.stores[store].download_and_store(url, key)

    def get_cache_path(self, store: BaseStores, url: str, key: str):
        if self.exists(store, key):
            return self.get_path(store, key)

        self.download_and_store(store, url, key)
        return self.get_path(store, key)
