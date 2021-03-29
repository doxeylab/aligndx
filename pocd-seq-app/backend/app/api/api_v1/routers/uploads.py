from fastapi import APIRouter, File, UploadFile, Form, Header, Depends
from typing import List
import shutil, os
from app.scripts import fqsplit 

UPLOAD_FOLDER = './uploads'   

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER) 

router = APIRouter() 

@router.post("/uploads") 
# ... is how pydantic declares a field as required  
# type hints declared via key: type
# async def create_upload_files(files: List[UploadFile] = File(...), token: str = Form(...)):
async def fileupload(files: List[UploadFile] = File(...), token: str = Form(...)):
    for file in files: 
        # get file name
        sample_name = file.filename.split('.')[0] 
        sample_dir = os.path.join(UPLOAD_FOLDER, token, sample_name)
        # create directory for uploaded sample, only if it hasn't been uploaded before
        # should I consider allowing repeated uploads of the same file?
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
        # fqsplit.chunker(file_location) 

    return {'response': 'successful'} 

@router.get("/files/{token}")
async def fileretrieve():
    token = ""
    sample_name = ""
    sample_dir = os.path.join(UPLOAD_FOLDER, token, sample_name)
    for dirname, subdir, file in os.walk(sample_dir): 
        for sample in subdir:
            print(file)
        return {"file": file}