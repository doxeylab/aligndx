from fastapi import APIRouter, File, UploadFile, Form 
from typing import List
import shutil, os
from datetime import datetime

from app.scripts import fqsplit 
# from app.db.database import database
from app.db.models import Sample as ModelSample
# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

UPLOAD_FOLDER = './uploads'   

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER) 

router = APIRouter() 

@router.post("/uploads")  
async def fileupload(token: str = Form(...), files: List[UploadFile] = File(...)):
    for file in files: 
        # get file name
        sample_name = file.filename.split('.')[0]  
        now = datetime.now()
        response = {'token': token, 
                 'sample': sample_name,
                 'created_date': now }
        query = await ModelSample.create(**response)

        # create directory for uploaded sample, only if it hasn't been uploaded before
        # should I consider allowing repeated uploads of the same file?
        
        sample_dir = os.path.join(UPLOAD_FOLDER, token, sample_name)
        if not os.path.isdir(UPLOAD_FOLDER):
            os.mkdir(UPLOAD_FOLDER)
        if not os.path.isdir(sample_dir): 
            os.makedirs(sample_dir)

        # declare upload location
        file_location = os.path.join(sample_dir, file.filename)
        with open(file_location, "wb+") as file_object:
            # saves file
            shutil.copyfileobj(file.file, file_object) 
            
        # splits uploaded fastq file into evenly distributed chunks
        fqsplit.chunker(file_location) 

        return {"response": "good"}

@router.get("/uploads/{token}")
async def fileretrieve(token: str ):
    id = await ModelSample.get(token)
    print(id)
    return {'id': id}  