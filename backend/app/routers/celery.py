from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dals.submissions import SubmissionsDal
from app.services.db import get_db 

router = APIRouter()

@router.post("/status_update")
async def status_update(sub_id: str, status: str, db: AsyncSession = Depends(get_db)):
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.update(sub_id, {'status': status})
    if query is not None:
        return True
    else:
        return False
