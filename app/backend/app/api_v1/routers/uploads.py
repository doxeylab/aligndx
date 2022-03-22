# python libraries
## system utils
from http.client import HTTPException
import sys, os, shutil, math, traceback, importlib

import aiofiles, asyncio 
from uuid import uuid4
from datetime import datetime
from typing import List 

import requests
from app.models.schemas.phi_logs import UploadLogBase

from fastapi import APIRouter, BackgroundTasks, HTTPException, File, UploadFile, Form, Body
from fastapi import Depends

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user
from app.scripts import salmonconfig 

from app.db.dals.phi_logs import UploadLogsDal
from app.db.dals.submissions import SubmissionsDal  
from app.db.dals.users import UsersDal
from app.models.schemas.submissions import SubmissionBase, UpdateSubmissionDate, SubmissionSchema
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings

from app.celery import tasks
from celery import chain

router = APIRouter()

# config
app_settings = get_settings()
settings = app_settings.UploadSettings()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER
INDEX_FOLDER = settings.INDEX_FOLDER
METADATA_FOLDER = settings.METADATA_FOLDER
STANDARD_UPLOADS = settings.STANDARD_UPLOADS
STANDARD_RESULTS = settings.STANDARD_RESULTS
REAL_TIME_UPLOADS = settings.REAL_TIME_UPLOADS
REAL_TIME_RESULTS = settings.REAL_TIME_RESULTS

for dirname in (UPLOAD_FOLDER, RESULTS_FOLDER, STANDARD_UPLOADS, STANDARD_RESULTS,  REAL_TIME_UPLOADS, REAL_TIME_RESULTS):
    if not os.path.isdir(dirname):
        os.mkdir(dirname)

# @router.get("/{token}")
# async def fileretrieve(token: str):
#     id = await ModelSample.get(token)
#     print(id)
#     return {'token': id}


@router.post("/test_salmon_container")
async def ping_salmon():
    try:
        commands = {"commands": ["salmon"]}
        x = requests.post("http://salmon:80/", json=commands)
        print(x.text)
        return x.text
    except Exception as e:
        return e


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
            sample_folder = os.path.join(STANDARD_UPLOADS, file_id)
            sample_dir = os.path.join(STANDARD_UPLOADS, file_id, sample_name)

            # create directory for uploaded sample, only if it hasn't been uploaded before
            if not os.path.isdir(sample_dir):
                os.makedirs(sample_dir)

            # declare upload location
            file_location = os.path.join(sample_dir, file.filename)

            # open file using write, binary permissions
            with open(file_location, "wb+") as f:
                shutil.copyfileobj(file.file, f)

            indexpath = os.path.join(INDEX_FOLDER, chosen_panel)
            results_dir = os.path.join(STANDARD_RESULTS, file_id, sample_name)

            commands = salmonconfig.commands(
                indexpath, file_location, results_dir)
            commands_lst.append(commands)

            call_salmon(commands_lst, sample_folder) 

    return {"Result": "OK",
            "File_ID": file_id}


async def standard_process(commands_lst, file_dir):
    loop = asyncio.get_running_loop()
    future = await loop.run_in_executor(None, call_salmon, commands_lst, file_dir)


def call_salmon(commands_lst, file_dir):

    with requests.Session() as s:
        for commands in commands_lst:
            s.post("http://salmon:80/", json=commands)
    shutil.rmtree(file_dir)


@router.post("/start-file")
async def start_file(
    current_user: UserDTO = Depends(get_current_user),
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    panels: List[str] = Body(...),
    db: AsyncSession = Depends(get_db)
):
    for option in panels:

        submission_type = "real-time"

        # it's worth noting that uuid4 generates random numbers, but the possibility of having a collision is so low, it's been estimated that it would take 90 years for such to occur.

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


        rt_dir = "{}/{}".format(REAL_TIME_UPLOADS, file_id)
        os.mkdir(rt_dir)
        os.mkdir("{}/{}".format(rt_dir, "upload_data"))
        os.mkdir("{}/{}".format(rt_dir, "salmon_data"))
        results_dir = "{}/{}".format(REAL_TIME_RESULTS, file_id)
        os.mkdir(results_dir)

        tasks.make_file_metadata.delay(rt_dir, filename, upload_chunk_size, salmon_chunk_size, number_of_chunks, email=current_user.email, fileId=file_id)
        tasks.make_file_data.delay(results_dir)

        return {"Result": "OK",
                "File_ID": file_id}


@router.post("/upload-chunk")
async def upload_chunk(  
    background_tasks: BackgroundTasks,
    current_user: UserDTO = Depends(get_current_user),
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    panels: str = Form(...),
    db: AsyncSession = Depends(get_db)
):

    rt_dir = "{}/{}".format(REAL_TIME_UPLOADS, file_id)
    upload_data = "{}/{}/{}.fastq".format(rt_dir, "upload_data", chunk_number)
    analysis_data_folder = "{}/{}".format(rt_dir, "salmon_data")
    results_dir = "{}/{}".format(REAL_TIME_RESULTS, file_id)
    data_dir = "{}/{}".format(results_dir, "data.json")
    
    async with aiofiles.open(upload_data, 'wb') as f:
        while content := await chunk_file.read(read_batch_size):
            await f.write(content)

    
    chain(
        tasks.process_new_upload.s(rt_dir, chunk_number), 
        tasks.perform_chunk_analysis.s(panels, INDEX_FOLDER, analysis_data_folder, results_dir),
        tasks.post_process.s(data_dir, METADATA_FOLDER, panels),
        tasks.pipe_status.s(rt_dir, data_dir)
    ).apply_async()

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

