from sqlalchemy import Column, String, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from .base import Base

class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=True)
    pipeline = Column(String)
    status = Column(String, nullable=False)
    created_date = Column(TIMESTAMP(timezone=True), nullable=False)
    finished_date = Column(TIMESTAMP(timezone=True), nullable=True)
    inputs = Column(JSON)
    # inputs = relationship("Inputs", back_populates="submissions")
    user = relationship("Users", back_populates="submissions")
