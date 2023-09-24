import boto3
from app.core.config.settings import settings


class ObjectStorage:
    def __init__(self, bucket, sub_id):
        self.s3 = boto3.client(
            service_name="s3",
            aws_access_key_id=settings.STORAGE_ACCESS_KEY_ID,
            aws_secret_access_key=settings.STORAGE_SECRET_ACCESS_KEY,
            region_name=settings.STORAGE_REGION_NAME,
            endpoint_url=settings.STORAGE_ENDPOINT_URL,
            config=boto3.session.Config(signature_version="s3v4"),
        )
        self.bucket = bucket
        self.sub_id = sub_id

    def get_key(self, key):
        return f"{self.sub_id}/{key}"

    def read(self, key):
        try:
            obj = self.s3.get_object(Bucket=self.bucket, Key=self.get_key(key))
            return obj["Body"].read().decode("utf-8")
        except Exception as e:
            print(f"An error occurred while reading {key}: {e}")
            return None

    def write(self, key, content):
        self.s3.put_object(Bucket=self.bucket, Key=self.get_key(key), Body=content)

    def move(self, source_key, destination_key):
        self.s3.copy_object(
            Bucket=self.bucket,
            CopySource={"Bucket": self.bucket, "Key": self.get_key(source_key)},
            Key=self.get_key(destination_key),
        )
        self.s3.delete_object(Bucket=self.bucket, Key=self.get_key(source_key))

    def delete(self, key):
        self.s3.delete_object(Bucket=self.bucket, Key=self.get_key(key))

    def delete_all(self):
        try:
            objects_to_delete = self.s3.list_objects_v2(
                Bucket=self.bucket, Prefix=f"{self.sub_id}/"
            )
            if "Contents" in objects_to_delete:
                for obj in objects_to_delete["Contents"]:
                    self.s3.delete_object(Bucket=self.bucket, Key=obj["Key"])
        except Exception as e:
            print(f"An error occurred while deleting objects under {self.sub_id}: {e}")
