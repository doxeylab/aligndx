from sqlalchemy.sql.expression import null
from sqlalchemy.sql.sqltypes import Date
from app.db.database import database, metadata

from sqlalchemy import (Column, DateTime, Integer, String, Table)
from sqlalchemy.sql import func

samples = Table(
    "samples",
    metadata,
    Column("token", String(50), primary_key=True),
    Column("sample", String(50)),
    Column("created_date", DateTime, nullable=False)   
    # Column("description", String(50))
    # Column("created_date", DateTime, default=func.now(), nullable=False)
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
          