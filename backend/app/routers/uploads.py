from http.client import HTTPException
from typing import Dict, List
import datetime

from app.models.schemas.phi_logs import UploadLogBase
from app.models.schemas.redis import MetaModel, ItemModel
from fastapi import APIRouter, HTTPException, Form, Body, Request
from fastapi import Depends

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.db.dals.phi_logs import UploadLogsDal
from app.db.dals.submissions import SubmissionsDal  
from app.models.schemas import submissions
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app import utils

from app.config.settings import settings

from app.celery.tasks import setup_flow, update_flow

import pandas as pd
import docker 
client = docker.from_env()

router = APIRouter()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER
TMP_FOLDER = settings.TMP_FOLDER

@router.post("/start")
async def start(
    current_user: UserDTO = Depends(get_current_user),
    items: List[str] = Body(...),
    pipeline: str = Body(...),
    name: str = Body(...),
    # inputs: dict = Body(...),
    # size: float = Body(...),
    db: AsyncSession = Depends(get_db)
):
    status='setup'

    created_date = datetime.datetime.now(datetime.timezone.utc).isoformat()
    db_entry = submissions.Base(
        user_id=current_user.id,
        created_date=created_date,
        pipeline=pipeline,
        items=items,
        status=status,
        name=name
        # size=size,
    ) 

    sub_dal = SubmissionsDal(db)
    query = await sub_dal.create(db_entry)
    sub_id = str(query)

    upload_dir = "{}/{}".format(UPLOAD_FOLDER, sub_id)
    results_dir = "{}/{}".format(RESULTS_FOLDER, sub_id)
    tmp_dir = "{}/{}".format(TMP_FOLDER, sub_id)

    dirs = [upload_dir, results_dir, tmp_dir]
    utils.dir_generator(dirs)

    sub_items={}
    for item in items:
        sub_item = ItemModel(
                uploaded=False,
                analyzed=False,
            )
        sub_items[item] = sub_item

    pipeline_data = pd.read_json(settings.PIPELINES)[pipeline]
    repo = pipeline_data['repository']
    
    user_inputs = f"--input {upload_dir}"
    # for k,v in pipeline_data['user_inputs'].items():
    #     flag = v['command'] + " " + inputs[k]
    #     user_inputs + flag + " " 

    predefined_inputs = ' '.join(pipeline_data['predefined_inputs'])
    custom_inputs = user_inputs + " " + predefined_inputs

    # run_command = f"docker run -d --rm --name {sub_id} -v /var/run/docker.sock:/var/run/docker.sock -v {settings.DATA_FOLDER}:{settings.DATA_FOLDER} -e 'NXF_HOME={settings.DATA_FOLDER}/nxf_home' nextflow/nextflow:latest nextflow -log {results_dir}/nxf/.nextflow.log run {repo} -latest -profile docker -w {results_dir}/nxf/work -c {settings.NXF_CONF} {custom_inputs} --outdir {results_dir}"
    
    run_name = f"run_{sub_id}"
    run_command = f"sh -c 'nextflow -log {tmp_dir}/.nextflow.log run {repo} -latest  -name {run_name} -profile docker  -w {tmp_dir} -c {settings.NXF_CONF} {custom_inputs} --outdir {results_dir} ; nextflow clean {run_name} -f'"
    
    container = client.containers.create(
            image="nextflow/nextflow:latest",
            command=run_command,
            detach=True,
            volumes=[
                "/var/run/docker.sock:/var/run/docker.sock",
                f"{settings.DATA_FOLDER}:{settings.DATA_FOLDER}"
            ],
            environment={
                "NXF_HOME": f'{settings.DATA_FOLDER}/nxf_home'
            },
            working_dir=f'{settings.DATA_FOLDER}'
        )

    processes = pipeline_data['processes']

    metadata = MetaModel(
        container_id=container.id,
        dirs={
            "updir": upload_dir,
            "rdir" : results_dir,
            "tdir": tmp_dir,
            "ddir": settings.DATA_FOLDER
        },
        items=sub_items,
        status=status,
        processes=processes
    )

    setup_flow(sub_id, metadata)

    return {"sub_id": sub_id}
    
@router.post("/tusd")
async def tusd(  
    request: Request,
    current_user: UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if request.headers['hook-name'] == 'post-finish':
        sub_dal = SubmissionsDal(db)
        
        body = await request.json()
        tus_data = body['Upload'] 
        metadata = tus_data['MetaData']
        sub_id = metadata['subId']

        query = await sub_dal.get_submission(current_user.id, sub_id)
        submission = submissions.Schema.from_orm(query)

        if submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")

        update_flow(tus_data, UPLOAD_FOLDER)
    
    return 200
