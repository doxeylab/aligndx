import os
import shutil


class LocalStorage:
    def __init__(self, store="", prefix=None):
        self.store = store
        self.prefix = prefix

    def get_path(self, key):
        if self.prefix:
            return os.path.join(self.store, self.prefix, key)
        else:
            return os.path.join(self.store, key)

    def read(self, key):
        with open(self.get_path(key), "r") as f:
            return f.read()

    def write(self, key, content):
        with open(self.get_path(key), "w") as f:
            f.write(content)

    def delete(self, key):
        os.remove(self.get_path(key))

    def delete_all(self):
        if self.prefix:
            path = os.path.join(self.store, self.prefix)
            if os.path.exists(path):
                shutil.rmtree(path)
        else:
            raise ValueError("Store does not exist")

    def move_within_store(self, src_key, dest_key):
        src_path = self.get_path(src_key)
        dest_path = self.get_path(dest_key)

        if not os.path.exists(src_path):
            raise FileNotFoundError(f"Source file {src_path} does not exist.")

        os.rename(src_path, dest_path)

    def move_between_stores(self, dest_storage, src_key, dest_key):
        src_path = self.get_path(src_key)
        dest_path = dest_storage.get_path(dest_key)

        with open(src_path, "rb") as src_file:
            with open(dest_path, "wb") as dest_file:
                shutil.copyfileobj(src_file, dest_file)

        os.remove(src_path)
