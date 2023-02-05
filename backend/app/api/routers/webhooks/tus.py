from http.client import HTTPException

from fastapi import APIRouter, HTTPException, Request
from fastapi import Depends

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user
from app.models import submissions

from app.db.dals.submissions import SubmissionsDal  
from app.services.db import get_db 
from app.services.celery import retrieve, update_metadata 
from app.config.settings import settings

import shutil

from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter() 

@router.post("/")
async def tusd(  
    request: Request,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):  
    headers = request.headers.get('hook-name')
    body = await request.json()
    tus_data = body['Upload'] 
    tus_metadata = tus_data.get('MetaData')
    sub_dal = SubmissionsDal(db)
    sub_id = tus_metadata.get('sub_id')
    fname = tus_metadata.get('filename')
    input_id = tus_metadata.get('input_id')
    if sub_id == None:
        raise HTTPException(status_code=405, detail="Submission requires a valid submission Id")
    metadata = retrieve.s(sub_id)()
    inputs = metadata.inputs

    if headers == 'pre-create':
        # check to see if the entity exists
        query = await sub_dal.get_submission(current_user.id, sub_id)
        submission = submissions.Entry.from_orm(query)
        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")
        # TODO check to see if input id exists
        else: 
            for inp in inputs:
                if inp.id == input_id:
                    file_meta = {
                        'size': tus_data['Size'],
                        'status': 'created'
                    }
                    if inp.file_meta == None:
                        inp.file_meta = {fname : file_meta}
                    else:
                        inp.file_meta[fname] = file_meta
                    inp.status = 'pending'
                    metadata.inputs = inputs

    if headers == 'post-finish':
        # update status and move and rename file to appropriate location
        for inp in inputs:
                if inp.id == input_id:
                    inp.file_meta[fname].status = 'finished'
                    metadata.inputs = inputs
                    if all({meta.status == 'finished' for filename, meta in  inp.file_meta.items()}):
                        inp.status = 'ready'
        file_id = tus_data['ID']
        src = "{}/{}".format(settings.UPLOAD_FOLDER, file_id)
        dst = "{}/{}".format(metadata.store[input_id], fname)
        shutil.move(src=src, dst=dst)

        info_id = tus_data['ID'] + '.info'
        info_src = "{}/{}".format(settings.UPLOAD_FOLDER, info_id)
        info_dst = "{}/{}".format(metadata.store['temp'], info_id)
        shutil.move(src=info_src, dst=info_dst)
    
    update_metadata.s(sub_id=sub_id, metadata=metadata)()

    return 200
