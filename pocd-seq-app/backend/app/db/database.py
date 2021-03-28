import os

from databases import Database

from sqlalchemy import (Column, DateTime, Integer, MetaData, String, Table,
                        create_engine)
from sqlalchemy.sql import func

from databases import Database

# defining database url
DATABASE_URL = os.getenv("DATABASE_URL")

# Creating engine
engine = create_engine(DATABASE_URL)


# SQLAlchemy 
metadata = MetaData()
notes = Table(
    "User",
    metadata,
    Column("id", String, primary_key=True),
    Column("sample", String(50)), 
    Column("created_date", DateTime, default=func.now(), nullable=False),
)

# databases query builder
database = Database(DATABASE_URL)