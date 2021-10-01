from array import ArrayType
from fastapi import APIRouter, File, UploadFile, Form 
from typing import List
import shutil, os
from datetime import datetime
from pydantic import BaseModel

from app.scripts import fqsplit, runsalmon
# from app.db.database import database
from app.db.models import Sample as ModelSample
# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes'
# eventually needs to handle various different panels of indexes
# indexpath = os.path.join(INDEX_FOLDER, 'sars_with_human_decoys')
indexpath = os.path.join(INDEX_FOLDER, 'sars_and_human_index')

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER) 
if not os.path.isdir(RESULTS_FOLDER):
    os.mkdir(RESULTS_FOLDER)  

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

        # open file using write, binary permissions
        with open(file_location, "wb+") as f:
            # saves file
            # why do this instead of f.write ? Shutil processes large files through chunking. Basically it won't load the whole file into memory
            # Also we can adjust buffer size if we deal with larger files
            # current buffer size set to 16*1024
            shutil.copyfileobj(file.file, f)  
         
        filename = file.filename.split('.')[1]
        results_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
        runsalmon.quantify(filename, indexpath, file_location, results_dir)


        # splits uploaded fastq file into evenly distributed chunks
        # fqsplit.chunker(file_location) 

        # chunk_dir = os.path.join(sample_dir, 'chunks')
        # for chunkfile in os.listdir(chunk_dir): 
        #     chunk_file_name = chunkfile.split('.')[1]
        #     chunkfile_dir = os.path.join(chunk_dir, chunkfile) 
        #     results_dir = os.path.join(RESULTS_FOLDER, token, sample_name, chunk_file_name)
        #     runsalmon.quantify(chunk_file_name, indexpath, chunkfile_dir, results_dir ) 
    return {"run": "complete"}  


@router.get("/uploads/{token}")
async def fileretrieve(token: str ):
    id = await ModelSample.get(token)
    print(id)
    return {'token': id}  
