import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dals.submissions import SubmissionsDal
from app.services.db import get_db 
from app.models.schemas import submissions

router = APIRouter()

@router.post("/status_update")
async def status_update(sub_id: str, status: str, db: AsyncSession = Depends(get_db)):
    sub_dal = SubmissionsDal(db)
    
    if status == 'completed':
        query = await sub_dal.get_by_id(sub_id)
        submission = submissions.Schema.from_orm(query)
        await sub_dal.update(sub_id, submissions.UpdateDateAndStatus(finished_date=datetime.datetime.now(), status=status))
        return True
    
    query = await sub_dal.update(sub_id, submissions.UpdateStatus(status=status))
    if query is not None:
        return True
    else:
        return False
