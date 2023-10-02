import uuid
import datetime
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse

from app.models import auth, submissions
from app.services.db import get_db 
from app.services.auth import get_current_user
from app.core.db.dals.submissions import SubmissionsDal
from app.celery.tasks import create_job, get_job_position, run_job, cleanup
from app.models.status import SubmissionStatus 

from app.models.stores import BaseStores
from app.storages.storage_manager import StorageManager

router = APIRouter()

@router.post('/start')
async def start_submission(submission: submissions.Request, current_user: auth.UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """
    Generates submission and returns a submission id
    """
    submission_entry = submissions.Entry(
        user_id=current_user.id,
        name=submission.name,
        pipeline=submission.pipeline,
        inputs=submission.inputs,
        status=SubmissionStatus.CREATED,
        created_date=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

    sub_dal = SubmissionsDal(db)
    query = await sub_dal.create(submission_entry)
    sub_id = str(query)

    create_job.apply_async(args=[ #type: ignore
        sub_id, submission.name, submission.pipeline, submission.inputs
    ])
    
    # Return a submission id for tracking
    return {"sub_id": sub_id}

@router.post('/run')
async def run_submission(runRequest: submissions.Run):
    """
    Runs submissions
    """
    sub_id = runRequest.sub_id
    run_job.apply_async(args=(sub_id,))

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
        response = submissions.Response.from_orm(sub)
        response_dict = response.dict()
        position = get_job_position(str(sub.id))
        response_dict['position'] = position
        data.append(response_dict)
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
            storage_manager = StorageManager(prefix=id)
            storage_manager.delete_all(BaseStores.RESULTS)
            cleanup.delay(id)
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

    storage_manager = StorageManager(prefix=sub_id)
    report_name = "report.html"

    if not storage_manager.exists(BaseStores.RESULTS,report_name):
        raise HTTPException(status_code=404, detail="Report not found")

    html = storage_manager.read(BaseStores.RESULTS,report_name)
    return html
 
def file_streamer(file_path):
    with open(file_path, mode="rb") as file:
        while chunk := file.read(8192):
            yield chunk

@router.get('/download/{sub_id}', response_class=StreamingResponse) 
async def download(sub_id: str, current_user: auth.UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # get submission data from db
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)
    if query is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    storage_manager = StorageManager(prefix=sub_id)
    report_name = "report.html"

    headers = {
        "Content-Disposition": f"attachment; filename={report_name}",
    }
    if storage_manager.exists(BaseStores.RESULTS, report_name):
        report_path = storage_manager.get_path(BaseStores.RESULTS, report_name)
        return StreamingResponse(file_streamer(report_path), headers=headers, media_type='application/octet-stream')
    else:
        raise HTTPException(status_code=400)