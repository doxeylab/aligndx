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
    Column("sample_name", String(50)),
    Column("panel", String(50), nullable=True),
    Column("result", JSON),
    Column("submission_type", String(50), nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=True),
    Column("created_date", DateTime, nullable=False),
    Column("finished_date", DateTime, nullable=True)
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
    Column("creation_time", DateTime, nullable=False)
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
    async def create_sample(cls, **sample):
        query = submissions.insert().values(**sample)
        sample_id = await database.execute(query)
        return sample_id

    @classmethod
    async def get_sample_info(cls, file_id):
        query = submissions.select().where(submissions.c.id == file_id)
        info = await database.fetch_one(query)
        return info
    
    @classmethod
    async def does_file_exist(cls,file_id, user_id, submission_type):
        query = (submissions.select()
                .where(submissions.c.sample_name == file_id,
                       submissions.c.user_id == user_id,
                       submissions.c.submission_type == submission_type)
                )
        info = await database.fetch_one(query)
        return info

    @classmethod
    async def save_upload_finished(cls, file_id, finished_date):
        query = (
            submissions.update()
            .where(submissions.c.id == file_id)
            .values(finished_date=finished_date)
        )
        sample = await database.execute(query)
        return sample

    @classmethod
    async def save_result(cls, file_id, result):
        query = (
            submissions.update()
            .where(submissions.c.id == file_id)
            .values(result=result)
        )
        sample = await database.execute(query)
        return sample 

    @classmethod
    async def get_user_submissions(cls, userid):
        query = submissions.select().where(submissions.c.user_id == userid)
        data = await database.fetch_all(query)
        return data

    @classmethod
    async def get_user_incomplete_submissions(cls, userid):
        query = submissions.select().where(submissions.c.user_id == userid
                                           and submissions.c.finished_date is not None)
        data = await database.fetch_all(query)
        return data


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
    async def get_uploads_in_range(cls, submission_id, start_kilobyte, kilobyte_size):
        query = upload_logs.select()\
            .where(upload_logs.c.submission_id == submission_id)\
            .where(upload_logs.c.start_kilobytes > start_kilobyte)\
            .where(upload_logs.c.start_kilobytes < start_kilobyte + kilobyte_size)
        logs = await database.fetch_all(query)
        return logs

    @classmethod
    async def log_deletion(cls, **log):
        query = deletion_logs.insert().values(**log)
        log = await database.execute(query)
        return log