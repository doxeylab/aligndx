from array import ArrayType
from fastapi import APIRouter, File, UploadFile, Form 
from typing import List 
import shutil, os
from datetime import datetime

from app.scripts import email_feature, runsalmon

# from app.db.database import database
from app.db.models import Sample as ModelSample

# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes'


if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)
if not os.path.isdir(RESULTS_FOLDER):
    os.mkdir(RESULTS_FOLDER)

router = APIRouter()


# @router.post("/uploads")
# async def fileupload(token: str = Form(...), files: List[UploadFile] = File(...)):
#     for file in files:
#         # get file name
#         sample_name = file.filename.split(".")[0]
#         now = datetime.now()
#         response = {"token": token, "sample": sample_name, "created_date": now}
#         query = await ModelSample.create(**response)
 
#         if not os.path.isdir(UPLOAD_FOLDER):
#             os.mkdir(UPLOAD_FOLDER)

#         # for deleting
#         sample_folder = os.path.join(UPLOAD_FOLDER, token)
        
#         sample_dir = os.path.join(UPLOAD_FOLDER, token, sample_name)
        
#         # create directory for uploaded sample, only if it hasn't been uploaded before
#         if not os.path.isdir(sample_dir): 
#             os.makedirs(sample_dir)

#         # declare upload location
#         file_location = os.path.join(sample_dir, file.filename)

#         # open file using write, binary permissions
#         with open(file_location, "wb+") as f:
#             # saves file
#             # why do this instead of f.write ? Shutil processes large files through chunking. Basically it won't load the whole file into memory
#             # Also we can adjust buffer size if we deal with larger files
#             # current buffer size set to 16*1024
#             shutil.copyfileobj(file.file, f)  
         
#         # indexpath = os.path.join(INDEX_FOLDER, 'sars_and_human_index')
#         indexpath = os.path.join(INDEX_FOLDER, 'sars_with_human_decoys')
#         filename = file.filename.split('.')[1]
#         results_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
#         runsalmon.quantify(filename, indexpath, file_location, results_dir)

#         try: 
#             shutil.rmtree(sample_folder)
#         except:
#             print("File couldn't be deleted")

#         # Code not currently in use

#         # splits uploaded fastq file into evenly distributed chunks
#         # fqsplit.chunker(file_location)

#         # chunk_dir = os.path.join(sample_dir, 'chunks')
#         # for chunkfile in os.listdir(chunk_dir):
#         #     chunk_file_name = chunkfile.split('.')[1]
#         #     chunkfile_dir = os.path.join(chunk_dir, chunkfile)
#         #     results_dir = os.path.join(RESULTS_FOLDER, token, sample_name, chunk_file_name)
#         #     runsalmon.quantify(chunk_file_name, indexpath, chunkfile_dir, results_dir )
#     return {"run": "complete"}


@router.get("/uploads/{token}")
async def fileretrieve(token: str):
    id = await ModelSample.get(token)
    print(id)
    return {'token': id} 

@router.post("/uploads/")
async def fileupload(token: str = Form(...), files: List[UploadFile] = File(...), panel: List[str] = Form(...), email: str = Form("")):
    for file in files:
        for option in panel:
            # get file name
            sample_name = file.filename.split('.')[0]
            chosen_panel = str(option.lower()) + "_index"
            
            now = datetime.now()
            response = {'token': token,
                     'sample': sample_name,
                     'panel': option.lower(),
                     'email': email,
                     'created_date': now }
            query = await ModelSample.create(**response)
    
            if not os.path.isdir(UPLOAD_FOLDER):
                os.mkdir(UPLOAD_FOLDER)
    
            # for deleting
            sample_folder = os.path.join(UPLOAD_FOLDER, token)
            sample_dir = os.path.join(UPLOAD_FOLDER, token, sample_name)
    
            # create directory for uploaded sample, only if it hasn't been uploaded before
            if not os.path.isdir(sample_dir): 
                os.makedirs(sample_dir)
    
            # declare upload location
            file_location = os.path.join(sample_dir, file.filename)
    
            # open file using write, binary permissions
            with open(file_location, "wb+") as f:
                shutil.copyfileobj(file.file, f) 
            
            indexpath = os.path.join(INDEX_FOLDER, chosen_panel)
            filename = file.filename.split('.')[1]
            results_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
            runsalmon.quantify(filename, indexpath, file_location, results_dir)

            try: 
                shutil.rmtree(sample_folder)
            except:
                print("File couldn't be deleted")

            if email == "" or email == None:
              print("No email")
              pass
            else:
              print(email)
              email_feature.send_email(email, sample_name)

    return {"run": "complete"}
