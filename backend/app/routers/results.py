import os
import zipfile
from io import BytesIO 
from sqlalchemy.ext.asyncio import AsyncSession

import pandas as pd 

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.scripts.nextflow.execution import Execution

from app.db.dals.users import UsersDal
from app.models.schemas.submissions import SubmissionSchema

from app.services.db import get_db 

from app.config.settings import settings
from app.celery.tasks import retrieve


router = APIRouter()

@router.get('/status/{sub_id}')
async def get_status(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    # location = os.path.join(settings.DATA_FOLDER,)
    # execution = Execution(location=location, id=sub_id, pipeline=sub_meta.pipeline)
    metadata = retrieve.s(sub_id)()
    return metadata.status

@router.get('/report/{sub_id}', response_class=HTMLResponse) 
async def get_report(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    report_dir = pd.read_json(settings.PIPELINES)[submission.pipeline]['report']

    report_path = os.path.join(settings.RESULTS_FOLDER, sub_id, report_dir)

    html = ""

    with open(report_path, 'r') as f:
        html = f.read()

    return html

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

@router.get('/download/{sub_id}', response_class=StreamingResponse) 
async def download(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")


    zip_subdir = os.path.join(settings.RESULTS_FOLDER, str(submission.id))
    name = "results.zip"
    
    return zip_dir(zip_subdir, name)

