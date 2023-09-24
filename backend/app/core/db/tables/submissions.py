from sqlalchemy import Column, String, ForeignKey, TIMESTAMP, Enum
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from .base import Base
from app.models.submissions import SubmissionStatus


class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    workflow_id = Column(String, nullable=False)
    name = Column(String, nullable=True)
    status = Column(Enum(SubmissionStatus), nullable=False, index=True)
    created_date = Column(TIMESTAMP(timezone=True), nullable=False)
    finished_date = Column(TIMESTAMP(timezone=True), nullable=True)
    inputs = Column(JSON)
    user = relationship("Users", back_populates="submissions")
