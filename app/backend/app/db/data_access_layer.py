from typing import List, Optional
from uuid import UUID

from datetime import datetime

from sqlalchemy.future import select
from sqlalchemy.orm import Session
from app.db.models import submissions

class SubDAL():
    def __init__(self, db_session: Session):
        self.db_session = db_session
    
    async def create_submission(self, id: UUID, temp_token: Optional[str], sample: str, panel: str, email: Optional[str], created_date: datetime):
        new_submission = submissions(id=id, temp_token=temp_token, sample=sample,panel=panel,email=email,created_date=created_date)
        self.db_session.add(new_submission)

 