from fastapi import APIRouter, File, UploadFile, Form 
from typing import List
import shutil, os
from scripts import fqsplit

UPLOAD_FOLDER = './uploads' 

if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)
 
router = APIRouter()

@router.post("/uploadfiles/") 
# ... is how pydantic declares a field as required  
# type hints declared via key: type
async def create_upload_files(files: List[UploadFile] = File(...), token: str = Form(...)):
    for file in files: 
        # get file name
        sample_name = file.filename.split('.')[0]
        
        # create directory for uploaded sample, only if it hasn't been uploaded before
        # should I consider allowing repeated uploads of the same file?
        if not os.path.isdir(UPLOAD_FOLDER):
            os.mkdir(os.path.join(UPLOAD_FOLDER, sample_name))
        
        # declare upload location
        file_location = os.path.join(UPLOAD_FOLDER, sample_name, file.filename)
        with open(file_location, "wb+") as file_object:
            # saves file
            shutil.copyfileobj(file.file, file_object) 
        
        # splits uploaded fastq file into evenly distributed chunks
        fqsplit.chunker(file_location) 
    # returns the names of files that were uploaded 
    return {"filenames": [file.filename for file in files]} 
 