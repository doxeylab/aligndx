from typing import Union
from .local_storage import LocalStorage
from app.core.config.settings import settings
from app.models.stores import BaseStores


class StorageManager:
    def __init__(self, prefix=None):
        self.stores = {}
        self.prefix = prefix

        for base_store in BaseStores:
            self.stores[base_store] = LocalStorage(
                    store=settings.BASE_STORES[base_store], prefix=self.prefix
                )

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