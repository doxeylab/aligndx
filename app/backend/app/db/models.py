from sqlalchemy.sql.sqltypes import JSON
from app.db.database import database, metadata

from sqlalchemy import Column, DateTime, String, Table, BigInteger, Integer, ForeignKey
from sqlalchemy.orm import relationship

samples = Table(
    "samples",
    metadata,
    Column("token", String(50), primary_key=True),
    Column("sample", String(50)),
    Column("panel", String(50), nullable=True),
    Column("email", String(50), nullable=True),
    Column("result", JSON),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=True),
    Column("created_date", DateTime, nullable=False),
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50)),
    Column("email", String(50)),
    Column("hashed_password", String(250)),
)


# REPOSITORIES
class Sample:
    @classmethod
    async def get_token(cls, token):
        query = samples.select().where(samples.c.token == token)
        sample = await database.fetch_one(query)
        return sample

    @classmethod
    async def get_sample(cls, panel):
        query = samples.select().where(samples.c.panel == panel)
        sample = await database.fetch_one(query)
        return panel

    @classmethod
    async def create(cls, **sample):
        query = samples.insert().values(**sample)
        sample_id = await database.execute(query)
        return sample_id

    @classmethod
    async def save_result(cls, token, result, user_id):
        query = (
            samples.update()
            .where(samples.c.token == token)
            .values(result=result, user_id=user_id)
        )
        sample = await database.execute(query)
        return sample


class User:
    @classmethod
    async def create(cls, user):
        query = users.insert().values(**vars(user))
        user_id = await database.execute(query)
        return user_id

    @classmethod
    async def get(cls, email):
        query = users.select().where(users.c.email == email)
        user = await database.fetch_one(query)
        return user
