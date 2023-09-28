import boto3
from app.core.config.settings import settings
from botocore.client import Config
from urllib.request import urlretrieve
import os


class ObjectStorage:
    def __init__(self, store, prefix=None):
        self.s3 = boto3.client(
            service_name="s3",
            aws_access_key_id=settings.STORAGE_ACCESS_KEY_ID,
            aws_secret_access_key=settings.STORAGE_SECRET_ACCESS_KEY,
            region_name=settings.STORAGE_REGION_NAME,
            endpoint_url=settings.STORAGE_ENDPOINT_URL,
            config=Config(signature_version="s3v4"),
        )
        self.store = store
        self.prefix = prefix

    def get_path(self, key, prefix_path=False):
        if prefix_path:
            return f"s3://{self.store}/{self.prefix}/"
        if self.prefix:
            return f"s3://{self.store}/{self.prefix}/{key}"
        else:
            return f"s3://{self.store}/{key}"

    def get_key(self, key):
        if self.prefix:
            return f"{self.prefix}/{key}"
        else:
            return f"{key}"

    def read(self, key):
        try:
            obj = self.s3.get_object(Bucket=self.store, Key=self.get_key(key))
            return obj["Body"].read().decode("utf-8")
        except Exception as e:
            print(f"An error occurred while reading {key}: {e}")
            return None

    def write(self, key, content):
        self.s3.put_object(Bucket=self.store, Key=self.get_key(key), Body=content)

    def delete(self, key):
        self.s3.delete_object(Bucket=self.store, Key=self.get_key(key))

    def delete_all(self):
        try:
            objects_to_delete = self.s3.list_objects_v2(
                Bucket=self.store, Prefix=f"{self.prefix}/"
            )
            if "Contents" in objects_to_delete:
                for obj in objects_to_delete["Contents"]:
                    self.s3.delete_object(Bucket=self.store, Key=obj["Key"])
        except Exception as e:
            print(f"An error occurred while deleting objects under {self.prefix}: {e}")

    def move_within_store(self, src_key, dest_key):
        try:
            self.s3.copy_object(
                Bucket=self.store,
                CopySource={"Bucket": self.store, "Key": self.get_key(src_key)},
                Key=self.get_key(dest_key),
            )
            self.delete(src_key)
        except Exception as e:
            print(f"An error occurred while moving {src_key} to {dest_key}: {e}")

    def move_between_stores(self, dest_storage, src_key, dest_key):
        try:
            copy_source = {"Bucket": self.store, "Key": self.get_key(src_key)}
            self.s3.copy_object(
                Bucket=dest_storage.store,
                CopySource=copy_source,
                Key=dest_storage.get_key(dest_key),
            )
            self.delete(src_key)
        except Exception as e:
            print(f"An error occurred while moving {src_key} to {dest_key}: {e}")

    def list_folders(self):
        try:
            prefix = f"{self.prefix}/" if self.prefix else ""
            response = self.s3.list_objects_v2(
                Bucket=self.store, Prefix=prefix, Delimiter="/"
            )
            if "CommonPrefixes" not in response:
                return []

            return [item["Prefix"] for item in response["CommonPrefixes"]]
        except Exception as e:
            print(f"Error listing folders in {self.store}/{self.prefix}: {e}")
            return []

    def exists(self, key):
        try:
            self.s3.head_object(Bucket=self.store, Key=self.get_key(key))
            return True
        except:
            return False

    def download_and_store(self, url, key):
        try:
            local_file_path = "/tmp/temp_file"  # Or some other temporary location
            urlretrieve(url, local_file_path)
            with open(local_file_path, "rb") as data:
                self.write(key, data)
            os.remove(local_file_path)
        except Exception as e:
            print(
                f"An error occurred while downloading and storing {url} to {key}: {e}"
            )
