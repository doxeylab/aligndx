import uuid, datetime, os, zipfile
from io import BytesIO 
from typing import List 
import pandas as pd 

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse

from app.models import auth, submissions, redis
from app.models.pipelines import inputs
from app.services.db import get_db 
from app.services.auth import get_current_user
from app.core.utils import dir_generator
from app.core.db.dals.submissions import SubmissionsDal
from app.core.config.settings import settings
from app.tasks import update_metadata, status_check

router = APIRouter()

@router.post('/start')
async def start_submission(submission: submissions.Request, current_user: auth.UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Generates submission and returns a submission id
    """
    # Create db submission entry
    status='setup'
    submission_entry = submissions.Entry(
        **{**submission.dict(),
            'user_id': current_user.id,
            'status': status,
            'created_date': datetime.datetime.now(datetime.timezone.utc).isoformat()         
        }
    )
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.create(submission_entry)
    sub_id = str(query)

    # Generate submission storage
    store = {
        'uploads': "{}/{}".format(settings.UPLOAD_FOLDER, sub_id),
        'results': "{}/{}".format(settings.RESULTS_FOLDER, sub_id),
        'temp': "{}/{}".format(settings.TMP_FOLDER, sub_id),
    }

    # Parse inputs and apply necessary transformations on inputs
    for inp in submission.inputs:
        if inp.input_type == 'select' or inp.input_type == 'text' or inp.input_type == 'predefined':
            inp.status = 'ready'
        if inp.input_type == 'file':
            inp.file_meta = {v : inputs.FileMeta(status='requested') for v in inp.values}
            path = "{}/{}/{}".format(settings.UPLOAD_FOLDER, sub_id, inp.id)
            store[inp.id] = path

    dir_generator(store.values())

    # Create a container for the submissions, configured to the pipeline chosen
    # config = pipelines.start(
    #     pipeline=submission.pipeline,
    #     name=submission.name + '_' + sub_id,
    #     inputs=submission.inputs,
    #     store=store
    # ) 

    # # Generate submission metadata for redis
    # metadata = redis.MetaModel(
    #     name=submission.name,
    #     container_id=config.container.id,
    #     inputs=submission.inputs,
    #     store=store,
    #     status=status,
    #     pipeline=submission.pipeline
    # )
    
    # update_metadata.s(sub_id=sub_id, metadata=metadata)()

    # # Initiate pipeline monitor
    # status_check.s(sub_id=sub_id).delay()

    # Return a submission id for tracking
    return {"sub_id": sub_id}

@router.get('/{sub_id}')
async def get_submission(sub_id : str ,current_user: auth.UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve submission information
    """
    sub_dal = SubmissionsDal(db) 
    submission = await sub_dal.get_submission(user_id=current_user.id, sub_id=sub_id)
    
    if submission is not None:
        return submissions.Response.from_orm(submission)
    else:
        raise HTTPException(status_code=404, detail="Item not found")

@router.get('/all/')
async def get_all_submissions(current_user: auth.UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve all submissions for a user
    """
    sub_dal = SubmissionsDal(db) 
    all = await sub_dal.get_all_submissions(current_user.id)
    
    data = []
    for sub in all:
        data.append(submissions.Response.from_orm(sub))
    return data

@router.get('/incomplete/')
async def get_incomplete_submissions(current_user: auth.UserDTO = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    sub_dal = SubmissionsDal(db) 
    incomplete = await sub_dal.get_incomplete_submissions(current_user.id)
    return submissions.Response.from_orm(incomplete)


@router.post('/delete')
async def del_result(ids: List[str], current_user: auth.UserDTO = Depends(get_current_user),  db: AsyncSession = Depends(get_db)):

    sub_dal = SubmissionsDal(db)
    for id in ids:
        uid = uuid.UUID(id)
        try: 
            query = await sub_dal.delete_by_id(uid)
        except:
            raise HTTPException(status_code=404, detail="Item not found")
    return 200 

@router.get('/report/{sub_id}', response_class=HTMLResponse) 
async def get_report(sub_id: str, current_user: auth.UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    # get submission data from db
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)
    if query is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission = submissions.Entry.from_orm(query)

    report_path = os.path.join(settings.RESULTS_FOLDER, sub_id, 'report.html')

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
async def download(sub_id: str, current_user: auth.UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # get submission data from db
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)
    if query is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission = submissions.Entry.from_orm(query)

    zip_subdir = os.path.join(settings.RESULTS_FOLDER, str(submission.id))
    name = f"{submission.name}_results.zip"
    
    if os.path.exists(zip_subdir) != True :
        raise HTTPException(status_code=404, detail="No results available")

    if len(os.listdir(zip_subdir)) == 0:
        raise HTTPException(status_code=404, detail="No results available")

    
    return zip_dir(zip_subdir, name)