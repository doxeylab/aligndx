import os 
import pandas as pd 
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException 

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.scripts.process.controller import Controller

from app.db.dals.users import UsersDal
from app.models.schemas.submissions import SubmissionSchema

from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings

RESULTS_FOLDER = settings.RESULTS_FOLDER

router = APIRouter()

@router.get('/{file_id}') 
async def get_result(file_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, file_id)

    if (not query):
        return HTTPException(status_code=404, detail="Item not found")

    # destructure submission data with [ydamtoc]
    submission = SubmissionSchema.from_orm(query)
    sample_dir = os.path.join(RESULTS_FOLDER, str(submission.id), submission.name)

    # load results based on submission type
    controller = Controller(process=submission.submission_type,panel=submission.panel,in_dir=sample_dir)
    data = controller.load_data()
    
    return data  