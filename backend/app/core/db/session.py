from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config.settings import settings

# config

# Enabled SQL Alchemy 2.0 API with future flag
# Enabled logging of engine generated SQL with echo flag
engine = create_async_engine(
    settings.async_database_url,
    future=True,
    echo=settings.DB_LOGS,
    pool_size=32,
    max_overflow=64,
)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
