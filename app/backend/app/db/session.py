from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.config.settings import get_settings

# config
app_settings = get_settings()
settings = app_settings.DatabaseSettings()

# Enabled SQL Alchemy 2.0 API with future flag
# Enabled logging of engine generated SQL with echo flag
engine = create_async_engine(settings.DATABASE_URL, future=True, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False,class_=AsyncSession)