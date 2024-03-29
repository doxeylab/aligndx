import os
import shutil
from urllib.request import urlretrieve


class LocalStorage:
    def __init__(self, store="", prefix=None):
        self.store = store
        self.prefix = prefix

    def get_path(self, key, prefix_path=False):
        if prefix_path:
            return os.path.join(self.store, self.prefix)
        if self.prefix:
            return os.path.join(self.store, self.prefix, key)
        else:
            return os.path.join(self.store, key)

    def read(self, key):
        with open(self.get_path(key), "r") as f:
            return f.read()

    def write(self, key, content):
        mode = "w" if isinstance(content, str) else "wb"
        with open(self.get_path(key), mode) as f:
            f.write(content)


    def delete(self, key):
        os.remove(self.get_path(key))

    def delete_all(self):
        if self.prefix:
            path = os.path.join(self.store, self.prefix)
            if os.path.exists(path):
                shutil.rmtree(path)
        else:
            raise ValueError("Store prefix does not exist")

    def move_within_store(self, src_key, dest_key):
        src_path = self.get_path(src_key)
        dest_path = self.get_path(dest_key)

        if not os.path.exists(src_path):
            raise FileNotFoundError(f"Source file {src_path} does not exist.")

        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        os.rename(src_path, dest_path)

    def move_between_stores(self, dest_storage, src_key, dest_key):
        src_path = self.get_path(src_key)
        dest_path = dest_storage.get_path(dest_key)

        if not os.path.exists(src_path):
            raise FileNotFoundError(f"Source file {src_path} does not exist.")
    
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(src_path, "rb") as src_file:
            with open(dest_path, "wb") as dest_file:
                shutil.copyfileobj(src_file, dest_file)
        
        os.remove(src_path)

    def list_folders(self):
        path = self.store if not self.prefix else os.path.join(self.store, self.prefix)
        if not os.path.exists(path):
            return []

        return [
            folder
            for folder in os.listdir(path)
            if os.path.isdir(os.path.join(path, folder))
        ]

    def exists(self, key):
        return os.path.exists(self.get_path(key))

    def download_and_store(self, url, key):
        try:
            local_file_path = self.get_path(key)
            urlretrieve(url, local_file_path)
        except Exception as e:
            print(
                f"An error occurred while downloading and storing {url} to {key}: {e}"
            )
