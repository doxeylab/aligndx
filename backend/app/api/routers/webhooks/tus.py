from http.client import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, HTTPException, Request
from fastapi import Depends

from app.services.auth import get_current_user
from app.models import submissions, auth
from app.models.pipelines import inputs

from app.core.db.dals.submissions import SubmissionsDal  
from app.services.db import get_db 
from app.celery.tasks import retrieve_metadata, update_metadata 

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
    metadata = retrieve_metadata.s(sub_id)()
    
    # Instantiate logger for this submission

    # File object requesting creation
    if hook_name == 'pre-create':
        # Check to see if submission exists
        sub_dal = SubmissionsDal(db)
        query = await sub_dal.get_submission(current_user.id, sub_id)

        submission = submissions.Entry.from_orm(query)
        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")
        
    # File object was created
    elif hook_name == 'post-create':
        file_id = tus_data.get('ID')
 
        for inp in metadata.inputs:
            # Find matching input identifier 
            if inp.id == input_id:
                inp.file_meta[fname] = inputs.FileMeta(
                    size=tus_data.get('Size'),
                    status='created',
                    offset=tus_data.get('Offset'),
                    name=file_id
                )
                inp.status = 'pending'


    # File object is completely uploaded
    elif hook_name == 'post-finish':
        file_id = tus_data.get('ID')

        # Update status for matching input and fileid
        for inp in metadata.inputs:
            if inp.id == input_id:
                inp.file_meta[fname].status = 'finished'
                inp.file_meta[fname].name = file_id
                

    update_metadata.s(sub_id=sub_id, metadata=metadata)()

    return 200
