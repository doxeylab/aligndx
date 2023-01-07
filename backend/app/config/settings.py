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
    REFRESH_TOKEN_EXPIRE_MINUTES = 30 * 24 * 14

    #  -- App Data -- 
    PROJECT_PATH = os.getenv("PROJECT_PATH")
    DATA_FOLDER =  PROJECT_PATH + '/data'

    #  -- User Data -- 

    UPLOAD_FOLDER = DATA_FOLDER + '/uploads' 
    RESULTS_FOLDER = DATA_FOLDER + '/results' 

    #  -- App Metadata --
    METADATA = DATA_FOLDER + '/metadata'
    PIPELINES = METADATA + '/pipelines.json'
    NXF_CONF = METADATA + '/nxf.conf'

    #  -- API Created Directories -- 
    DIRS = [DATA_FOLDER, UPLOAD_FOLDER, RESULTS_FOLDER]

    # Chunk settings

    read_batch_size = 4096
    salmon_chunk_size = math.floor(1e9)
    upload_chunk_size = 8e6
    chunk_ratio = salmon_chunk_size / upload_chunk_size   

    # Tool settings
    TOOLS = {"rna-seq": "salmon", "metagenomics": "kraken2"}
    ACCESS_POINTS = {"salmon": "http://salmon:80/", "kraken2": "http://kraken2:80/"}

    # Notification settings

    sender_email: str = os.getenv("NOTIFICATION_EMAIL") 
    password: str = os.getenv("NOTIFICATION_EMAIL_PASSWORD")
    base_url: str = os.getenv("BASE_URL")

    # Payments Stripe settings
    stripe_secret_key: str = os.getenv("STRIPE_SECRET_KEY") 
    stripe_publishable_key: str = os.getenv("STRIPE_PUBLISHABLE_KEY")
    stripe_webhook_secret: str = os.getenv("STRIPE_WEBHOOK_SECRET")

    # Redis settings
    BROKER_URL: str = os.getenv("CELERY_BROKER_URL")
    BACKEND_RESULTS_URL: str = os.getenv("CELERY_RESULT_BACKEND")
    REDIS_URL: str = os.getenv("REDIS_URL")

    #  -- Db settings --
    
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    DB_LOGS = False
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