import os 
import pandas as pd 
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException 

from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user

from app.db.dals.users import UsersDal
from app.db.dals.submissions import SubmissionsDal 
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.schemas.submissions import UpdateSubmissionResult, SubmissionSchema

from app.scripts import analyze, realtime 

from app.config.settings import settings

# config 
settings = settings.ResultSettings

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
async def standard_results(file_id: str, current_user: UserDTO = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, file_id)

    if (not query):
        return HTTPException(status_code=404, detail="Item not found")

    submission = SubmissionSchema.from_orm(query)
    sample_name = submission.name
    panel = submission.panel
    file_id = str(submission.id)
    headers=['Name', 'TPM'] 

    metadata = analyze.metadata_load(METADATA_FOLDER, panel)
    sample_dir = os.path.join(STANDARD_RESULTS, file_id, sample_name)
    quant_dir = os.path.join(sample_dir,'quant.sf')   
    result = analyze.analyze_handler(sample_name, headers, metadata, quant_dir)
    
    sub_dal = SubmissionsDal(db)
    update_query = await sub_dal.update(submission.id, UpdateSubmissionResult(result=result))
    
    return result 

class Chunk_id(BaseModel):
    account_id: str 

@router.get('/chunked/{file_id}')
async def chunked_results(file_id: str, current_user: UserDTO = Depends(get_current_user),db: AsyncSession = Depends(get_db)):

    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, file_id)

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
