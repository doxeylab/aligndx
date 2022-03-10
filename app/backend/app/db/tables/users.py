from sqlalchemy import Column, String

from app.db.tables.base import Base

class Users(Base):
    __tablename__ = "users"

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    hashed_password = Column(String(250), nullable=False)