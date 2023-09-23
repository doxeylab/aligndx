import os
import shutil


class LocalStorage:
    def __init__(self, directory=""):
        self.directory = directory

    def get_path(self, key):
        return os.path.join(self.directory, key)

    def read(self, key):
        with open(self.get_path(key), "r") as f:
            return f.read()

    def write(self, key, content):
        with open(self.get_path(key), "w") as f:
            f.write(content)

    def move(self, source_key, destination_key):
        shutil.move(self.get_path(source_key), self.get_path(destination_key))

    def delete(self, key):
        os.remove(self.get_path(key))

    def delete_all(self):
        sub_id_directory = self.get_path("")
        if os.path.exists(sub_id_directory):
            shutil.rmtree(sub_id_directory)
