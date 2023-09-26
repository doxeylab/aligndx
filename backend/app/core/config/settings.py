import os
from pydantic import BaseSettings
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from functools import lru_cache
from typing import Optional
from app.models.stores import BaseStores, StorageTypes


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
    DATA_FOLDER = PROJECT_PATH + "/data"
    DOWNLOADS_PATH = DATA_FOLDER + "/downloads"
    PIPELINES_PATH = DATA_FOLDER + "/pipelines"
    PIPELINES_REPO = os.getenv("PIPELINES_REPO")
    PIPELINES_REPO_TOKEN = os.getenv("PIPELINES_REPO_TOKEN")

    #  -- User Data --

    UPLOAD_FOLDER = DATA_FOLDER + "/uploads"
    RESULTS_FOLDER = DATA_FOLDER + "/results"
    TMP_FOLDER = DATA_FOLDER + "/tmp"

    #  -- API Created Directories --
    DIRS = [DATA_FOLDER, DOWNLOADS_PATH, UPLOAD_FOLDER, RESULTS_FOLDER, TMP_FOLDER]

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

    # Service settings
    CELERY_API_KEY: str = os.getenv("CELERY_API_KEY")
    SERVICES = {"celery": CELERY_API_KEY}

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

    #  -- Storage settings --

    STORAGE_TYPE = StorageTypes.OBJECT

    STORAGE_ACCESS_KEY_ID = os.getenv("STORAGE_ACCESS_KEY_ID")
    STORAGE_SECRET_ACCESS_KEY = os.getenv("STORAGE_SECRET_ACCESS_KEY")
    STORAGE_REGION_NAME = os.getenv("STORAGE_REGION_NAME")
    STORAGE_ENDPOINT_URL = os.getenv("STORAGE_ENDPOINT_URL")

    BASE_STORES = {
        BaseStores.UPLOADS: "uploads",
        BaseStores.SUBMISSIONS: "submissions",
        BaseStores.RESULTS: "results",
    }


@lru_cache()
def get_settings() -> AppSettings:
    return AppSettings()


settings = get_settings()
