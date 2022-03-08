# python libraries
import os, asyncio, importlib, json
from typing import Optional
import pandas as pd 
from pydantic import BaseModel

# FastAPI
from fastapi import APIRouter, Depends, HTTPException 

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

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

@router.get('/{file_id}')
async def get_result(file_id: str, current_user: UserDTO = Depends(get_current_user)):
    query = await ModelSample.get_sample_info(current_user.id, file_id)

    if (not query):
        return HTTPException(status_code=404, detail="Item not found")
    
    data = query["result"]

    return data

# -- Standard upload results --
 
@router.get('/standard/{file_id}') 
async def standard_results(file_id: str, current_user: UserDTO = Depends(get_current_user)):
    query = await ModelSample.get_sample_info(current_user.id, file_id,)


    if (not query):
        return HTTPException(status_code=404, detail="Item not found")

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

@router.get('/chunked/{file_id}')
async def chunked_results(file_id: str, current_user: UserDTO = Depends(get_current_user)):
    query = await ModelSample.get_sample_info(current_user.id, file_id,)

    if (not query):
        return HTTPException(status_code=404, detail="Item not found")

    file_id = str(query['id'])
    sample_name = query['sample_name']
    headers=['Name', 'TPM']
    data_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, "data.json")

    try:
        stored_data = pd.read_json(data_dir, orient="table")
    except:
        stored_data = None
    if stored_data is not None:
        stored_data.set_index('Pathogen', inplace=True)
        data = realtime.data_loader(stored_data, sample_name, headers, status="ready") 
        return data
    else:
        return {"status":"pending"}
