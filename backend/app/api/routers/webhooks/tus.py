from http.client import HTTPException

from fastapi import APIRouter, HTTPException, Request
from fastapi import Depends

from app.services.auth import get_current_user
from app.models import submissions, auth

from app.core.db.dals.submissions import SubmissionsDal  
from app.services.db import get_db 
from app.tasks import retrieve, update_metadata 
from app.core.config.settings import settings

import shutil

from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter() 

@router.post("/")
async def tusd(  
    request: Request,
    current_user: auth.UserDTO = Depends(get_current_user),
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

    if headers == 'pre-create':
        # check to see if the entity exists
        query = await sub_dal.get_submission(current_user.id, sub_id)
        submission = submissions.Entry.from_orm(query)
        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")
        # TODO check to see if input id exists
    
    if headers == 'post-create':
        file_id = tus_data['ID']
        for inp in metadata.inputs:
            if inp.id == input_id:
                file_meta = {
                    'size': tus_data['Size'],
                    'status': 'created',
                    'fname': fname
                }
                if inp.file_meta == None:
                    inp.file_meta = {file_id : file_meta}
                else:
                    inp.file_meta[file_id] = file_meta
                inp.status = 'pending'

    if headers == 'post-finish':
        # update status and move and rename file to appropriate location
        file_id = tus_data['ID']

        for inp in metadata.inputs:
                if inp.id == input_id:
                    new_file_meta = inp.file_meta[file_id] 
                    new_file_meta.status = 'finished'
                    inp.file_meta[file_id] = new_file_meta
                    if all({meta.status == 'finished' for filename, meta in  inp.file_meta.items()}):
                        inp.status = 'ready'
                        
        src = "{}/{}".format(settings.UPLOAD_FOLDER, file_id)
        dst = "{}/{}".format(metadata.store[input_id], fname)
        shutil.move(src=src, dst=dst)

        info_id = file_id + '.info'
        info_src = "{}/{}".format(settings.UPLOAD_FOLDER, info_id)
        info_dst = "{}/{}".format(metadata.store['temp'], info_id)
        shutil.move(src=info_src, dst=info_dst)
    
    update_metadata.s(sub_id=sub_id, metadata=metadata)()

    return 200
