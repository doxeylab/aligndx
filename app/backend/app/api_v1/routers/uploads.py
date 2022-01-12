import sys
import math
from array import ArrayType
from uuid import uuid4
import aiofiles
from fastapi import APIRouter, BackgroundTasks, File, UploadFile, Form, Body
from typing import List 
import shutil, os, requests
from datetime import datetime

import pandas as pd

from app.scripts import email_feature, salmonconfig

# from app.db.database import database
from app.db.models import Sample as ModelSample

# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

read_batch_size = 4096
salmon_chunk_size = math.floor(8e6)
upload_chunk_size = 4e6
chunk_ratio = salmon_chunk_size / upload_chunk_size

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes'

REAL_TIME_FOLDER = UPLOAD_FOLDER + '/real_time'
RL_FILE_FOLDER = REAL_TIME_FOLDER + "/file_meta"
RL_CHUNK_FOLDER = REAL_TIME_FOLDER + "/chunk_data"


if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)
if not os.path.isdir(RESULTS_FOLDER):
    os.mkdir(RESULTS_FOLDER)

for dirname in (REAL_TIME_FOLDER, RL_FILE_FOLDER, RL_CHUNK_FOLDER):
    if not os.path.isdir(dirname):
        os.mkdir(dirname)


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

            commands = salmonconfig.commands(filename, indexpath, file_location, results_dir)
            x = requests.post("http://salmon:80/", json = commands )

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



@router.post("/test_salmon_container/")
async def fileupload():
    try:
        commands = {"commands": ["salmon"]}
        x = requests.post("http://salmon:80/", json = commands )
        print(x.text)
        return x.text 
    except Exception as e:
        return e


@router.post("/start-file")
def start_file(
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    token: str = Body(...)
):
    uuid = uuid4()
    file_id = str(uuid)

    os.mkdir("uploads/{}".format(file_id))
    with open("uploads/{}/meta.txt".format(file_id), 'w') as f:
        f.write(filename)
        f.write('\n')
        f.write(str(number_of_chunks))
    os.mkdir("results/{}".format(file_id))

    return {"Result": "OK",
            "File_ID": file_id}


@router.post("/upload-chunk")
async def upload_chunk(
    background_tasks: BackgroundTasks,
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    token: str = Form(...),
):
    async with aiofiles.open("uploads/{}/{}.fastq".format(file_id, chunk_number), 'wb') as f:
        while content := await chunk_file.read(read_batch_size):
            await f.write(content)

    num_chunks = None
    with open("uploads/{}/meta.txt".format(file_id)) as f:
        num_chunks = int(f.readlines()[1])

    background_tasks.add_task(process_salmon_chunks, file_id)

    # if chunk_number + 1 == num_chunks:
    #     background_tasks.add_task(
    #         start_final_chunk_analysis, file_id, chunk_number)
    # else:
    #     background_tasks.add_task(start_chunk_analysis, file_id, chunk_number)

    return {"Result": "OK"}


def process_salmon_chunks(file_id):
    upload_chunk_nums = [int(fname.split('.')[0]) for fname in os.listdir(
        'uploads/{}'.format(file_id)) if fname.split('.')[0].isnumeric()]
    salmon_chunk_nums = [int(fname.split('.')[0]) for fname in os.listdir(
        'chunks/{}'.format(file_id)) if fname.split('.')[0].isnumeric()]

    chunks_to_assemble = range(max(salmon_chunk_nums) if len(salmon_chunk_nums) > 0 else 1,
                               math.ceil(max(upload_chunk_nums) / chunk_ratio) + 1)

    for salmon_chunk_num in chunks_to_assemble:
        start_num = math.ceil((salmon_chunk_num - 1) * chunk_ratio) + 1
        end_num = math.ceil(salmon_chunk_num * chunk_ratio) + 1

        upload_chunk_range = range(start_num, end_num)

        if set(upload_chunk_range).issubset(set(upload_chunk_nums)):
            make_salmon_chunk(file_id, salmon_chunk_num, upload_chunk_range)


def make_salmon_chunk(file_id, salmon_chunk_number, upload_chunk_range):
    next_chunk_data = b''

    with open('chunks/{}/{}.fastq'.format(file_id, salmon_chunk_number), 'ab') as salmon_chunk:
        fsize = 0
        for upload_chunk_number in upload_chunk_range:
            with open('uploads/{}/{}.fastq'.format(file_id, upload_chunk_number), 'rb') as upload_chunk:
                data = upload_chunk.read()
                fsize += sys.getsizeof(data)

                if fsize > salmon_chunk_size:
                    lines = data.decode('utf8').split('\n')
                    firstchars = [line[0] for indx, line in enumerate(
                        lines) if indx > 0 and indx < len(lines)]

                    atsign_linenum = None
                    for i in range(4):
                        if all([firstchar == ['@', firstchar, '+', firstchar][(indx + i) % 4] for
                                indx, firstchar in enumerate(firstchars)]):
                            atsign_linenum = i + 1
                    print(atsign_linenum)

                    salmon_chunk.write(
                        '\n'.join(
                            lines[:atsign_linenum]).encode('utf8').strip())
                    next_chunk_data = '\n'.join(
                        lines[atsign_linenum:]).encode('utf8').strip()
                else:
                    salmon_chunk.write(data)

    with open('chunks/{}/{}.fastq'.format(file_id, salmon_chunk_number + 1), 'wb') as salmon_chunk:
        salmon_chunk.write(next_chunk_data)


def start_final_chunk_analysis(file_id, chunk_number):
    start_chunk_analysis(file_id, chunk_number)
    # finish_file_analysis(file_id)


def start_chunk_analysis(file_id, chunk_number):
    commands_lst = salmonconfig.commands(
        sample='{}_{}'.format(file_id, chunk_number),
        indexpath="indexes/bacterial_index",
        filepath="chunks/{}/{}.fastq".format(
            file_id, chunk_number),
        resultspath="results/{}/{}".format(
            file_id, chunk_number)
    )

    requests.post("http://localhost:8002/", json=commands_lst)

    os.remove("chunks/{}/{}.fastq".format(file_id, chunk_number))


@router.get("/results/{file_id}")
async def get_results(file_id: str):
    if not os.path.isfile("results/{}/final.csv".format(file_id)):
        return 404

    dist = pd.read_csv("results/{}/final.csv".format(file_id))

    return {"Results": dist.to_dict()}
