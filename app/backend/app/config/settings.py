from pydantic import BaseSettings
from fastapi.security import OAuth2PasswordBearer 
from passlib.context import CryptContext

from functools import lru_cache
from typing import Optional

import os, math

class AppSettings(BaseSettings):

    #  -- Auth -- 
    
    oauth2_scheme_auto_error = OAuth2PasswordBearer(tokenUrl="users/token")
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token", auto_error=False)
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

    #  -- User Data -- 

    #  -- App Data --
    
    INDEX_FOLDER = './indexes' 

    UPLOAD_FOLDER = './uploads' 
    RESULTS_FOLDER = './results'
    METADATA_FOLDER = "./metadata"  

    STANDARD_UPLOADS = UPLOAD_FOLDER + '/standard'
    STANDARD_RESULTS = RESULTS_FOLDER + '/standard'

    REAL_TIME_UPLOADS = UPLOAD_FOLDER + '/real_time'
    REAL_TIME_RESULTS = RESULTS_FOLDER + '/real_time' 
    
    for dirname in (UPLOAD_FOLDER, RESULTS_FOLDER, STANDARD_UPLOADS, STANDARD_RESULTS,  REAL_TIME_UPLOADS,  REAL_TIME_RESULTS):
        if not os.path.isdir(dirname):
            os.mkdir(dirname) 

    # Chunk settings

    read_batch_size = 4096
    salmon_chunk_size = math.floor(1e9)
    upload_chunk_size = 8e6
    chunk_ratio = salmon_chunk_size / upload_chunk_size   

    # Notification settings

    sender_email: str = os.getenv("NOTIFICATION_EMAIL") 
    password: str = os.getenv("NOTIFICATION_EMAIL_PASSWORD")
    base_url: str = os.getenv("BASE_URL")

    # Payments Stripe settings

    stripe_key: str = os.getenv("STRIPE_KEY") 
    stripe_webhook_secret: str = os.getenv("STRIPE_WEBHOOK_SECRET")
    stripe_publishable_key: str = os.getenv("STRIPE_PUBLISHABLE_KEY")

    #  -- Db settings --
    
    DATABASE_URL: str = os.getenv("DATABASE_URL")
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

settings = get_settings()