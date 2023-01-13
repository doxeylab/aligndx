import uuid
import os, zipfile
from io import BytesIO 
from typing import List 

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user
from app.db.dals.users import UsersDal
from app.db.dals.submissions import SubmissionsDal

from app.services.db import get_db 
from app.models.schemas.submissions import SubmissionSchema
from app.config.settings import settings


router = APIRouter()

# Get the submission results for the currently logged in user
@router.get('/submissions/')
async def get_standard_submissions(current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    sub_dal = SubmissionsDal(db) 
    submissions = await sub_dal.get_all_submissions(current_user.id)
    return submissions
        

@router.get('/incomplete/')
async def get_incomplete_submissions(current_user: UserDTO = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    sub_dal = SubmissionsDal(db) 
    submissions = await sub_dal.get_incomplete_submissions(current_user.id)
    return submissions


@router.post('/delete_record')
async def del_result(ids: List[str], current_user: UserDTO = Depends(get_current_user),  db: AsyncSession = Depends(get_db)):

    sub_dal = SubmissionsDal(db)
    for id in ids:
        uid = uuid.UUID(id)
        query = await sub_dal.delete_by_id(uid)

        if (not query):
            print("didn't work")
            raise HTTPException(status_code=404, detail="Item not found")
        
        else :
            print(query)

@router.get('/report/{sub_id}', response_class=HTMLResponse) 
async def get_report(sub_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
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
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)
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