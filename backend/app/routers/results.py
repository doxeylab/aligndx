import os

from fastapi import APIRouter, Depends, HTTPException, Body
import zipfile
from io import BytesIO 
from fastapi.responses import StreamingResponse

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.scripts.process.controller import Controller

from app.db.dals.users import UsersDal
from app.models.schemas.submissions import SubmissionSchema

from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings
from app.celery.tasks import retrieve

RESULTS_FOLDER = settings.RESULTS_FOLDER

router = APIRouter()

@router.get('/{sub_id}') 
async def get_result(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    sub_meta = retrieve.s(sub_id)()

    print(sub_meta)
    return 200


@router.get('/download/{sub_id}') 
async def download(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    def zipdir(path):
        zip_io = BytesIO()
        with zipfile.ZipFile(zip_io, mode='w', compression=zipfile.ZIP_DEFLATED) as temp_zip:
            for root, dirs, files in os.walk(path):
                for file in files:
                    temp_zip.write(os.path.join(path,file),
                     os.path.relpath(os.path.join(root, file), 
                                       os.path.join(path, '..')))
        return StreamingResponse(
            iter([zip_io.getvalue()]), 
            media_type="application/x-zip-compressed", 
            headers = { "Content-Disposition": f"attachment; filename=images.zip"}
        )
    zip_subdir = os.path.join(RESULTS_FOLDER, str(submission.id))

    return zipdir(zip_subdir)