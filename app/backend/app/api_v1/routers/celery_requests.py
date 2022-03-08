from fastapi import APIRouter 
from pydantic import BaseModel

from app.db.models import Sample as ModelSample
from app.scripts.email_feature import send_email
from app.scripts import analyze, realtime 
import pandas as pd 

router = APIRouter()

class EndAnalysisPipeline(BaseModel):
    fileName: str
    fileId: str
    data_dir: str
    email: str

@router.post("/end_pipe")
async def end_pipe(endRequest : EndAnalysisPipeline):
    '''
    Chunked requests finish by posting here to save the end_result, and then send out emails. Note that this is blocking, but it is negligible 
    '''
    fileName = endRequest.fileName
    fileId = endRequest.fileId
    data_dir = endRequest.data_dir
    email = endRequest.email
    stored_data = pd.read_json(data_dir, orient="table")
    headers=['Name', 'TPM']

    data = realtime.data_loader(stored_data, fileName, headers, status="ready")
    
    await ModelSample.save_result(fileId, data)

    result_link = f'/result?submission={fileId}'    
    send_email(receiver_email=email, sample=fileName, link=result_link)
    print(f"sent email to {email}")

    return {"Result": "OK"}