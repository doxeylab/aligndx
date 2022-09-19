from http.client import HTTPException
import math

import aiofiles 
from datetime import datetime
from typing import List 

from app.models.schemas.phi_logs import UploadLogBase
from app.models.schemas.redis import MetaModel
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Body
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

from app.celery.tasks import setup_flow, analysis_flow

router = APIRouter()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER

# not currently in use
# @router.post("/")
# async def file_upload(
#     files: List[UploadFile] = File(...),
#     panel: List[str] = Form(...),
#     current_user: UserDTO = Depends(get_current_user),
#     db: AsyncSession = Depends(get_db)
# ):

#     commands_lst = []
#     for file in files:

#         for option in panel:
#             process = "rna-seq"
#             # get file name
#             sample_name = file.filename.split('.')[0]

#             sub_dal = SubmissionsDal(db)
#             query = await sub_dal.create(SubmissionBase(
#                 name=sample_name,
#                 panel=option.lower(), 
#                 submission_type="standard",
#                 user_id=current_user.id,
#                 created_date= datetime.now(),
#                 ))
#             file_id = str(query)

#             # for deleting
#             sample_dir = os.path.join(UPLOAD_FOLDER, file_id)

#             # create directory for uploaded sample, only if it hasn't been uploaded before
#             if not os.path.isdir(sample_dir):
#                 os.makedirs(sample_dir)

#             # declare upload location
#             file_location = os.path.join(sample_dir, file.filename)
#             results_dir = os.path.join(RESULTS_FOLDER, file_id)

#             # open file using write, binary permissions
#             with open(file_location, "wb+") as f:
#                 shutil.copyfileobj(file.file, f)
    
#             tasks.perform_chunk_analysis.s(process=process, chunk_number=None, file_dir=file_location, panel=option.lower(), results_dir=results_dir) 
 
#     return {"Result": "OK",
#             "File_ID": file_id}

# Chunking startpoint
@router.post("/start-file")
async def start_file(
    current_user: UserDTO = Depends(get_current_user),
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    file_size: float = Body(...),
    panels: List[str] = Body(...),
    process: str = Body(...),
    db: AsyncSession = Depends(get_db)
):
    for option in panels:

        submission_type = process 

        response = SubmissionBase(
            name=filename,
            panel=option.lower(),
            file_size=file_size,
            created_date=datetime.now(),
            submission_type=submission_type,
            user_id=current_user.id
        )

        sub_dal = SubmissionsDal(db)
        query = await sub_dal.create(response)
        file_id = str(query)

        upload_dir = "{}/{}".format(UPLOAD_FOLDER, file_id)
        results_dir = "{}/{}".format(RESULTS_FOLDER, file_id)
        upload_data = "{}/{}".format(upload_dir, "upload_data")
        tool_data = "{}/{}".format(upload_dir, "tool_data")

        dirs = [upload_dir, results_dir, upload_data, tool_data]
        dir_generator(dirs)
        
        metadata = {
            "updir": upload_data,
            "rdir": results_dir,
            "tooldir": tool_data,
            "fname": filename,
            "total": number_of_chunks,
            "processed" : 0,
            "status": "setup",
            "data": ""
        }

        setup_flow(file_id, MetaModel(**metadata), results_dir)

        return {"Result": "OK",
                "File_ID": file_id}

# Main chunked upload route
@router.post("/upload-chunk")
async def upload_chunk(  
    current_user: UserDTO = Depends(get_current_user),
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    file_extension: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    file_dir = "{}/{}".format(UPLOAD_FOLDER, file_id)
    upload_data = "{}/{}/{}.{}".format(file_dir, "upload_data", chunk_number, file_extension) 
    
    # async with aiofiles.open(upload_data, 'wb') as f:
    #     while content := await chunk_file.read(read_batch_size):
    #         await f.write(content)

    with open(upload_data, 'wb') as f:
        content = await chunk_file.read(read_batch_size)
        f.write(content)

    analysis_flow(file_id)
    
    uplog_dal = UploadLogsDal(db)
    log = UploadLogBase(
        submission_id=file_id,
        start_kilobytes=math.ceil(chunk_number * upload_chunk_size / 1024),
        size_kilobytes=math.ceil(upload_chunk_size / 1024),
        creation_time=datetime.now()
    )
    query = await uplog_dal.create(log)
    
    return {"Result": "OK"}

# Chunking pipeline cleanup and sideeffects
@router.post("/end-file")
async def end_file(
    current_user: UserDTO = Depends(get_current_user),
    file_id: str = Body(..., embed=True),
    db: AsyncSession = Depends(get_db)
):
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, file_id)
    submission = SubmissionSchema.from_orm(query)

    if submission is None:
        raise HTTPException(status_code=404, detail="File not found")

    if submission.finished_date is None:
        sub_dal = SubmissionsDal(db)
        await sub_dal.update(file_id, UpdateSubmissionDate(finished_date=datetime.now()))
        return {"Result": "OK"}

    else:
        return {"Result": "Already exists"}
