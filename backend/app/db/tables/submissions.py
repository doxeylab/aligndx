from sqlalchemy import Column, Float, Integer, String, ForeignKey, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.tables.base import Base

class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_date = Column(DateTime, nullable=False)
    pipeline = Column(String)
    items = Column(ARRAY(String))
    # size = Column(Float, nullable=False)
    name = Column(String, nullable=True)

    finished_date = Column(DateTime, nullable=True)

    user = relationship("Users", back_populates="submissions")
