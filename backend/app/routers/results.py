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
import pandas as pd 

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

def zip_dir(zip_subdir, name): 
    """
    Compress a directory (ZIP file).
    """
    zip_io = BytesIO()
    with zipfile.ZipFile(zip_io, mode='w', compression=zipfile.ZIP_DEFLATED) as temp_zip: 
            for dir, subdirs, fnames in os.walk(zip_subdir):
                for fname in fnames:
                    fpath= os.path.join(dir,fname)
                    arcname = os.path.relpath(fpath, zip_subdir)
                    temp_zip.write(fpath, arcname)
    return StreamingResponse(
            iter([zip_io.getvalue()]), 
            media_type="application/x-zip-compressed", 
            headers = { "Content-Disposition": f"attachment; filename={name}"}
        )

@router.get('/download/{sub_id}') 
async def download(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")


    zip_subdir = os.path.join(RESULTS_FOLDER, str(submission.id))
    name = "results.zip"
    results = pd.read_json(settings.PIPELINES)[submission.pipeline]['results']
    
    return zip_dir(zip_subdir, name)
