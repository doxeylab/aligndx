from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON

from app.db.base import Base

class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    submission_type = Column(String, nullable=False)
    panel = Column(String)
    created_date = Column(DateTime, nullable=False)
    finished_date = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)