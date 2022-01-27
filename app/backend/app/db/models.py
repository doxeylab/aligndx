from sqlalchemy.sql.sqltypes import JSON
from app.db.database import database, metadata

from sqlalchemy import Column, DateTime, String, Table, BigInteger, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from uuid import uuid4

# samples = Table(
#     "samples",
#     metadata,
#     Column("token", String(50), nullable=False),
#     Column("sample", String(50)),
#     Column("id", UUID(as_uuid = True), primary_key=True, nullable = False, default=uuid4),
#     Column("panel", String(50), nullable=True),
#     Column("email", String(50)),
#     Column("created_date", DateTime, nullable=False)
# )

submissions = Table(
    "submissions",
    metadata,
    Column("id", UUID(), primary_key=True, nullable=False, default=uuid4),
    Column("token", String(50), nullable=False),
    Column("sample", String(50)),
    Column("panel", String(50), nullable=True),
    Column("email", String(50), nullable=True),
    Column("result", JSON),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=True),
    Column("created_date", DateTime, nullable=False)
)

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50)),
    Column("email", String(50)),
    Column("hashed_password", String(250)),
)

upload_logs = Table(
    "upload_logs",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("submission_id", UUID(), ForeignKey("submissions.id"), nullable=False),
    Column("start_kilobytes", Integer, nullable=False),
    Column("size_kilobytes", Integer, nullable=False),
)

deletion_logs = Table(
    "deletion_logs",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("upload_id", Integer, ForeignKey("upload_logs.id"), nullable=False),
    Column("deletion_time", DateTime, nullable=False),
)


# REPOSITORIES
class Sample:
    @classmethod
    async def get_token(cls, token):
        query = submissions.select().where(submissions.c.token == token)
        sample = await database.fetch_one(query)
        return sample

    @classmethod
    async def get_sample(cls, panel):
        query = submissions.select().where(submissions.c.panel == panel)
        sample = await database.fetch_one(query)
        return panel

    @classmethod
    async def create(cls, **sample):
        query = submissions.insert().values(**sample)
        sample_id = await database.execute(query)
        return sample_id

    @classmethod
    async def save_result(cls, token, result, user_id):
        query = (
            submissions.update()
            .where(submissions.c.token == token)
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


class Logs:
    @classmethod
    async def log_upload(cls, **log):
        query = upload_logs.insert().values(**log)
        log = await database.execute(query)
        return log

    @classmethod
    async def log_deletion(cls, **log):
        query = deletion_logs.insert().values(**log)
        log = await database.execute(query)
        return log
