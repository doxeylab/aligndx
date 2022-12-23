from http.client import HTTPException
from datetime import datetime
from typing import Dict, List

from app.models.schemas.phi_logs import UploadLogBase
from app.models.schemas.redis import MetaModel, ItemModel
from fastapi import APIRouter, HTTPException, Form, Body, Request
from fastapi import Depends

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.db.dals.phi_logs import UploadLogsDal
from app.db.dals.submissions import SubmissionsDal  
from app.db.dals.users import UsersDal
from app.models.schemas.submissions import SubmissionBase, UpdateSubmissionDate, SubmissionSchema
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.utilities import dir_generator

from app.config.settings import settings

from app.celery.tasks import setup_flow, update_flow

router = APIRouter()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER

@router.post("/start")
async def start(
    current_user: UserDTO = Depends(get_current_user),
    items: List[str] = Body(...),
    pipeline: str = Body(...),
    # size: float = Body(...),
    db: AsyncSession = Depends(get_db)
):

    db_entry = SubmissionBase(
        user_id=current_user.id,
        created_date=datetime.now(),
        pipeline=pipeline,
        items=items,
        # size=size,
    ) 

    sub_dal = SubmissionsDal(db)
    query = await sub_dal.create(db_entry)
    sub_id = str(query)

    upload_dir = "{}/{}".format(UPLOAD_FOLDER, sub_id)
    results_dir = "{}/{}".format(RESULTS_FOLDER, sub_id)

    dirs = [upload_dir, results_dir]
    dir_generator(dirs)

    sub_items={}
    for item in items:
        sub_item = ItemModel(
                uploaded=False,
                analyzed=False,
            )

        sub_items[item] = sub_item.dict()

    metadata = MetaModel(
        updir=upload_dir,
        rdir=results_dir,
        items=sub_items,
        status='setup', 
        data="",
    )

    setup_flow(sub_id, metadata, results_dir)

    return {"sub_id": sub_id}
    
@router.post("/tusd")
async def tusd(  
    request: Request,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if request.headers['hook-name'] == 'post-finish':
        users_dal = UsersDal(db)
        
        body = await request.json()
        metadata = body['Upload']['MetaData']
        sub_id = metadata['sub_id']
        fname = metadata['filename']
        print(sub_id,fname)

        query = await users_dal.get_submission(current_user.id, sub_id)
        submission = SubmissionSchema.from_orm(query)

        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")

        # update_flow(sub_id, fname)

        # if submission.finished_date is None:
        #     sub_dal = SubmissionsDal(db)
        #     await sub_dal.update(sub_id, UpdateSubmissionDate(finished_date=datetime.now()))
        #     return {"Result": "OK"}
     
    return 200
