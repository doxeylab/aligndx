import asyncio
from typing import AsyncGenerator, Generator, Callable

import pytest
from fastapi import FastAPI

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import Base
from app.db.session import async_session, engine

@pytest.fixture(scope="session")
def event_loop(request) -> Generator:
    '''
    Fixture for creating an instance of the default event loop for each test case.
    '''
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture()
async def db_session() -> AsyncSession:
    '''
    Fixture to generate a db_session for tests 
    '''
    async with engine.begin() as connection:
        # drop and create tables
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)
        # execute some db operation
        async with async_session(bind=connection) as session:
            yield session
            await session.flush()
            await session.rollback()


@pytest.fixture()
def override_get_db(db_session: AsyncSession) -> Callable:
    '''
    Fixture to generate override for db connection handler.
    '''
    async def _override_get_db():
        yield db_session

    return _override_get_db


@pytest.fixture()
def app(override_get_db: Callable) -> FastAPI:
    from app.services.db import get_db
    from app.main import app
    '''
    Fixture that overrides the original db connection handler
    '''

    app.dependency_overrides[get_db] = override_get_db
    return app


@pytest.fixture()
async def async_client(app: FastAPI) -> AsyncGenerator:
    '''
    Fixture for async testing client
    '''
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
