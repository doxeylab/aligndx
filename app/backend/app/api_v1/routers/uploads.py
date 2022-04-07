from http.client import HTTPException
import os, shutil, math

import aiofiles 
from datetime import datetime
from typing import List 

from app.models.schemas.phi_logs import UploadLogBase

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

from app.config.settings import settings

from app.celery import tasks

router = APIRouter()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER


@router.post("/")
async def file_upload(
    files: List[UploadFile] = File(...),
    panel: List[str] = Form(...),
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    commands_lst = []
    for file in files:

        for option in panel:
            process = "rna-seq"
            # get file name
            sample_name = file.filename.split('.')[0]
            chosen_panel = str(option.lower()) + "_index"

            sub_dal = SubmissionsDal(db)
            query = await sub_dal.create(SubmissionBase(
                name=sample_name,
                panel=option.lower(), 
                submission_type="standard",
                user_id=current_user.id,
                created_date= datetime.now(),
                ))
            file_id = str(query)

            # for deleting
            sample_dir = os.path.join(UPLOAD_FOLDER, file_id)

            # create directory for uploaded sample, only if it hasn't been uploaded before
            if not os.path.isdir(sample_dir):
                os.makedirs(sample_dir)

            # declare upload location
            file_location = os.path.join(sample_dir, file.filename)
            results_dir = os.path.join(RESULTS_FOLDER, file_id)

            # open file using write, binary permissions
            with open(file_location, "wb+") as f:
                shutil.copyfileobj(file.file, f)
    
            tasks.perform_chunk_analysis.s(process=process, chunk_number=None, file_dir=file_location, panel=option.lower(), results_dir=results_dir) 
 
    return {"Result": "OK",
            "File_ID": file_id}

@router.post("/start-file")
async def start_file(
    current_user: UserDTO = Depends(get_current_user),
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    panels: List[str] = Body(...),
    # process: str = Body(...),
    db: AsyncSession = Depends(get_db)
):
    for option in panels:
        process="rna-seq"

        submission_type = process 

        response = SubmissionBase(
            name=filename,
            panel=option.lower(),
            created_date=datetime.now(),
            submission_type=submission_type,
            user_id=current_user.id
        )

        sub_dal = SubmissionsDal(db)
        query = await sub_dal.create(response)
        file_id = str(query)


        file_dir = "{}/{}".format(UPLOAD_FOLDER, file_id)
        os.mkdir(file_dir)
        os.mkdir("{}/{}".format(file_dir, "upload_data"))
        os.mkdir("{}/{}".format(file_dir, "tool_data"))
        results_dir = "{}/{}".format(RESULTS_FOLDER, file_id)
        os.mkdir(results_dir)

        tasks.make_file_metadata.s(file_dir, filename, upload_chunk_size, salmon_chunk_size, number_of_chunks,
                                   email=current_user.email, fileId=file_id, panel=option, process=process).apply_async()
        tasks.make_file_data.delay(results_dir)

        return {"Result": "OK",
                "File_ID": file_id}


@router.post("/upload-chunk")
async def upload_chunk(  
    current_user: UserDTO = Depends(get_current_user),
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    panels: str = Form(...),
    db: AsyncSession = Depends(get_db)
):

    file_dir = "{}/{}".format(UPLOAD_FOLDER, file_id)
    upload_data = "{}/{}/{}.fastq".format(file_dir, "upload_data", chunk_number) 
    
    async with aiofiles.open(upload_data, 'wb') as f:
        while content := await chunk_file.read(read_batch_size):
            await f.write(content)

    tasks.process_new_upload.s(file_dir, chunk_number).apply_async() 
    
    uplog_dal = UploadLogsDal(db)
    log = UploadLogBase(
        submission_id=file_id,
        start_kilobytes=math.ceil(chunk_number * upload_chunk_size / 1024),
        size_kilobytes=math.ceil(upload_chunk_size / 1024),
        creation_time=datetime.now()
    )
    query = uplog_dal.create(log)
    
    return {"Result": "OK"}


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
