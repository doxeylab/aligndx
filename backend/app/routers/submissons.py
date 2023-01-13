import uuid
import os, zipfile
from io import BytesIO 
from typing import List 
import pandas as pd 

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse

from app.auth.models import UserDTO
from app.models.schemas.submissions import SubmissionsResponse
from app.auth.auth_dependencies import get_current_user
from app.db.dals.submissions import SubmissionsDal

from app.services.db import get_db 
from app.models.schemas.submissions import SubmissionSchema
from app.config.settings import settings


router = APIRouter()

@router.get('/{sub_id}')
async def get_submission(sub_id : str ,current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve submission information
    """
    sub_dal = SubmissionsDal(db) 
    submissions = await sub_dal.get_submission(user_id=current_user.id, sub_id=sub_id)
    return SubmissionsResponse.from_orm(submissions)

@router.get('/all/')
async def get_all_submissions(current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all submissions for a user
    """
    sub_dal = SubmissionsDal(db) 
    submissions = await sub_dal.get_all_submissions(current_user.id)
    
    data = []
    for sub in submissions:
        data.append(SubmissionsResponse.from_orm(sub))
    return data

@router.get('/incomplete/')
async def get_incomplete_submissions(current_user: UserDTO = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    sub_dal = SubmissionsDal(db) 
    submissions = await sub_dal.get_incomplete_submissions(current_user.id)
    return SubmissionsResponse.from_orm(submissions)


@router.post('/delete')
async def del_result(ids: List[str], current_user: UserDTO = Depends(get_current_user),  db: AsyncSession = Depends(get_db)):

    sub_dal = SubmissionsDal(db)
    for id in ids:
        uid = uuid.UUID(id)
        try: 
            query = await sub_dal.delete_by_id(uid)
            return 200
        except:
            raise HTTPException(status_code=404, detail="Item not found")


@router.get('/report/{sub_id}', response_class=HTMLResponse) 
async def get_report(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)
    if query is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission = SubmissionSchema.from_orm(query)
        
    report_dir = pd.read_json(settings.PIPELINES)[submission.pipeline]['report']
    report_path = os.path.join(settings.RESULTS_FOLDER, sub_id, report_dir)

    if os.path.exists(report_path) != True:
        raise HTTPException(status_code=404, detail="Report not found")

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
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)
    if query is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission = SubmissionSchema.from_orm(query)

    zip_subdir = os.path.join(settings.RESULTS_FOLDER, str(submission.id))
    name = "results.zip"
    
    if os.path.exists(zip_subdir) != True :
        raise HTTPException(status_code=404, detail="No results available")

    if len(os.listdir(zip_subdir)) == 0:
        raise HTTPException(status_code=404, detail="No results available")

    
    return zip_dir(zip_subdir, name)