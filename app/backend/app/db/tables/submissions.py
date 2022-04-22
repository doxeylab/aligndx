from sqlalchemy import Column, Float, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.tables.base import Base

class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    submission_type = Column(String, nullable=False)
    file_size = Column(Float, nullable=False)
    panel = Column(String)
    created_date = Column(DateTime, nullable=False)
    finished_date = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)

    user = relationship("Users", back_populates="submissions")
