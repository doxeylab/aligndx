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
    hook_name = request.headers.get('hook-name') 
    request_body = await request.json()

    tus_data = request_body.get('Upload', {})
    tus_meta = tus_data.get('MetaData')
    sub_id, fname, input_id = *(tus_meta.get(i) for i in ['sub_id', 'filename', 'input_id']),

    # Check to see if submission Id exists on metadata
    if sub_id == None or input_id == None:
        raise HTTPException(status_code=405, detail="Missing required metadata")
    metadata = retrieve.s(sub_id)()

    # File object requesting creation
    if hook_name == 'pre-create':
        # Check to see if submission exists
        sub_dal = SubmissionsDal(db)
        query = await sub_dal.get_submission(current_user.id, sub_id)

        submission = submissions.Entry.from_orm(query)
        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")

    # File object was created
    if hook_name == 'post-create':
        file_id = tus_data.get('ID')
        
        for inp in metadata.inputs:
            # Find matching input identifier 
            if inp.id == input_id:
                file_meta = {
                    'size': tus_data.get('Size'),
                    'status': 'created',
                    'fname': fname
                }
                inp.file_meta = {file_id : file_meta}
                inp.status = 'pending'

    # File object is completely uploaded
    if hook_name == 'post-finish':
        file_id = tus_data.get('ID')

        # Update status for matching input and fileid
        for inp in metadata.inputs:
                if inp.id == input_id:
                    new_file_meta = inp.file_meta.get(file_id) 
                    new_file_meta.status = 'finished'
                    inp.file_meta[file_id] = new_file_meta

    # Move and rename file to appropriate location
        src = "{}/{}".format(settings.UPLOAD_FOLDER, file_id)
        dst = "{}/{}".format(metadata.store[input_id], fname)
        shutil.move(src=src, dst=dst)

        info_id = file_id + '.info'
        info_src = "{}/{}".format(settings.UPLOAD_FOLDER, info_id)
        info_dst = "{}/{}".format(metadata.store['temp'], info_id)
        shutil.move(src=info_src, dst=info_dst)

    update_metadata.s(sub_id=sub_id, metadata=metadata)()

    return 200
