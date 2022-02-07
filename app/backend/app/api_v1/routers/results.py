# python libraries
import os, asyncio, importlib, json
from typing import Optional
import pandas as pd 
from pydantic import BaseModel

# FastAPI
from fastapi import APIRouter, Depends, Request, status
from fastapi import Cookie, Query

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user, get_current_user_no_exception

# db components
from app.db.models import Sample as ModelSample
from app.db.schema import Sample as SchemaSample

# core scripts
from app.scripts import analyze, realtime 
from app.scripts.web_socket.manager import ConnectionManager

# settings
from app.config.settings import get_settings

# config
app_settings = get_settings()
settings = app_settings.ResultSettings()

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


router = APIRouter()

# -- Standard upload results --
 
@router.get('/standard/{file_id}') 
async def standard_results(file_id: str, current_user: UserDTO = Depends(get_current_user_no_exception)):
    query = await ModelSample.get_sample_info(file_id)  

    sample_name = query['sample_name']
    panel = query['panel']
    file_id = str(query['id'])
    headers=['Name', 'TPM'] 

    metadata = analyze.metadata_load(METADATA_FOLDER, panel)
    sample_dir = os.path.join(STANDARD_RESULTS, file_id, sample_name)
    quant_dir = os.path.join(sample_dir,'quant.sf')   
    result = analyze.analyze_handler(sample_name, headers, metadata, quant_dir)
    
    await ModelSample.save_result(file_id, json.dumps(result))
    
    return result

class Chunk_id(BaseModel):
    account_id: str 

@router.get('/standardplus/{file_id}')
async def standard_plus(file_id: str, current_user: UserDTO = Depends(get_current_user_no_exception)):
    if current_user:
        query = await ModelSample.get_sample_info(file_id) 
        file_id = str(query['id'])
        sample_name = query['sample_name']

        headers=['Name', 'TPM']
        get_current_chunk_task = importlib.import_module(
            "app.worker.tasks.get_curr_chunk"
        )

        while True: 
            current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())
            if current_chunk:
                if current_chunk["chunk_number"] == current_chunk["total_chunks"]:
                    df = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
                    data = realtime.data_loader(df, sample_name, headers, status="complete")
                    return data
                else:
                    continue
            else:
                message = {"status": "pending"} 
                return message
    else:
        return {"message":"Unauthorized"}  

        

@router.get('/standard/submissions/')
async def get_standard_submissions(current_user: UserDTO = Depends(get_current_user_no_exception)):
    if current_user:
        query = await ModelSample.get_user_submissions(current_user.id)
        return query
    else:
        return {"message":"Unauthorized"}  
        
# @router.get('/rt/submissions{token}')
# async def get_rt_submissions(file_id: "str", current_user: UserDTO = Depends(get_current_user_no_exception)):
#     if current_user:
        
#         # query database using UserDTO and get list of submissions.Then 

#         get_current_chunk_task = importlib.import_module(
#         "app.worker.tasks.get_curr_chunk"
#         )
#         current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())
#         if current_chunk:
#             if current_chunk["chunk_number"] == current_chunk["total_chunks"]:
#                 df = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
#                 data = realtime.data_loader(df, sample_name, headers, status="complete") 
#                 return data
#             else:
#                 df = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
#                 data = realtime.data_loader(df, sample_name, headers, status="ready")
#                 return data
#         else:
#             message = {"status": "pending"} 
#             return message
#     else:
#         return