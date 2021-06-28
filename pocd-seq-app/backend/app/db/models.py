from app.db.database import database, metadata

from sqlalchemy import (Column, DateTime, String, Table, BigInteger)

samples = Table(
    "samples",
    metadata,
    Column("token", String(50), primary_key=True),
    Column("sample", String(50)),
    Column("created_date", DateTime, nullable=False)
    # Column("description", String(50))
    # Column("created_date", DateTime, default=func.now(), nullable=False)
)

users = Table(
    "users",
    metadata,
    Column("id", BigInteger, primary_key=True),
    Column("username", String(50)),
    Column("name", String(50)),
    Column("email", String(50)),
    Column("hashed_password", String(250)),
)


# class Sample:
#     @classmethod
#     async def get(cls, token):
#         query = samples.select().where(samples.c.token == token)
#         sample = await database.fetch_one(query)
#         return sample

#     @classmethod
#     async def create(cls, **sample):
#         query = samples.insert().values(**sample)
#         sample_id = await database.execute(query)
#         return sample_id


# REPOSITORIES
class Sample:
    @classmethod
    async def get(cls, token):
        query = samples.select().where(samples.c.token == token)
        sample = await database.fetch_one(query)
        return sample

    @classmethod
    async def create(cls, **sample):
        query = samples.insert().values(**sample)
        sample_id = await database.execute(query)
        return sample_id


class User:
    @classmethod
    async def create(cls, user):
        query = users.insert().values(**vars(user))
        user_id = await database.execute(query)
        return user_id
