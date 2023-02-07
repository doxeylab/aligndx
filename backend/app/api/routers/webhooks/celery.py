import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db.dals.submissions import SubmissionsDal
from app.services.db import get_db 
from app.models import submissions

router = APIRouter()

@router.post("/status_update")
async def celery(sub_id: str, status: str, db: AsyncSession = Depends(get_db)):
    sub_dal = SubmissionsDal(db)

    query = await sub_dal.get_by_id(sub_id)
    submission = submissions.Entry.from_orm(query)

    if submission is not None:
        if status == 'completed':
            finished_date = datetime.datetime.now(datetime.timezone.utc).isoformat()
            await sub_dal.update(sub_id, submissions.UpdateDateAndStatus(finished_date=finished_date, status=status))
            return 200
        else:
            await sub_dal.update(sub_id, submissions.UpdateStatus(status=status))
        
    else:
        raise HTTPException(status_code=404, detail="Item not found")
