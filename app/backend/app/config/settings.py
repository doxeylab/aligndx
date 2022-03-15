from pydantic import BaseSettings
from fastapi.security import OAuth2PasswordBearer 
from passlib.context import CryptContext

from functools import lru_cache
from typing import Optional

import os, math

class AppSettings(BaseSettings):

    #  -- Auth --
    class AuthSettings():
        oauth2_scheme_auto_error = OAuth2PasswordBearer(tokenUrl="users/token")
        oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token", auto_error=False)
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        SECRET_KEY = os.getenv("SECRET_KEY")
        ALGORITHM = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES = 30
        REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

    #  -- Default directory tree --
    class FolderSettings():
        # folders
        INDEX_FOLDER = './indexes' 

        UPLOAD_FOLDER = './uploads' 
        RESULTS_FOLDER = './results'
        METADATA_FOLDER = "./metadata"  

        STANDARD_UPLOADS = UPLOAD_FOLDER + '/standard'
        STANDARD_RESULTS = RESULTS_FOLDER + '/standard'

        REAL_TIME_UPLOADS = UPLOAD_FOLDER + '/real_time'
        REAL_TIME_RESULTS = RESULTS_FOLDER + '/real_time' 

    # Inherits from above and adds chunk config
    class UploadSettings(FolderSettings):
        # chunk settings
        read_batch_size = 4096
        salmon_chunk_size = math.floor(4e6)
        upload_chunk_size = 8e5
        chunk_ratio = salmon_chunk_size / upload_chunk_size   

    # Inherits foldersettings
    class ResultSettings(FolderSettings):
        pass

    class NotificationSettings():
        sender_email = os.getenv("NOTIFICATION_EMAIL") 
        password = os.getenv("NOTIFICATION_EMAIL_PASSWORD")
        base_url = os.getenv("BASE_URL")

    class DatabaseSettings():
        DATABASE_URL = os.getenv("DATABASE_URL")
        @property
        def async_database_url(self) -> Optional[str]:
            return (
                self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
                if self.DATABASE_URL
                else self.DATABASE_URL
            )


@lru_cache()
def get_settings() -> AppSettings: 
    return AppSettings()