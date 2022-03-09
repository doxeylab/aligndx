from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base

class UploadLogs(Base):
    __tablename__ = "upload_logs"

    submission_id = Column(UUID(), ForeignKey("submissions.id"), nullable=False)
    start_kilobytes = Column(Integer, nullable=False)
    size_kilobytes = Column(Integer, nullable=False)
    creation_time = Column(DateTime, nullable=False)

class DeletionLogs(Base):
    __tablename__ = "deletion_logs"

    upload_id = Column(Integer, ForeignKey("upload_logs.id"), nullable=False)
    deletion_time = Column(DateTime, nullable=False)
