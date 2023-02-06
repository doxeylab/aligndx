from sqlalchemy import Column, String, ForeignKey, TIMESTAMP, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .base import Base

class Submissions(Base):
    __tablename__ = "submissions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_date = Column(TIMESTAMP(timezone=True), nullable=False)
    pipeline = Column(String)
    items = Column(ARRAY(String))
    # size = Column(Float, nullable=False)
    name = Column(String, nullable=True)
    status = Column(String, nullable=False)

    finished_date = Column(TIMESTAMP(timezone=True), nullable=True)

    user = relationship("Users", back_populates="submissions")
