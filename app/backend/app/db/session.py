from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings

# config  

# Enabled SQL Alchemy 2.0 API with future flag
# Enabled logging of engine generated SQL with echo flag
engine = create_async_engine(settings.async_database_url, future=True, echo=True)
async_session = sessionmaker(engine, expire_on_commit=False,class_=AsyncSession)
