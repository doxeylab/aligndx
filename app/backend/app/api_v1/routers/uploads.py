from array import ArrayType
from uuid import uuid4
import aiofiles, asyncio, aiohttp 
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

memory_batch_size = 400000

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes' 
METADATA_FOLDER = "./metadata"

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
async def fileupload(
    token: str = Form(...),
    files: List[UploadFile] = File(...), 
    panel: List[str] = Form(...), 
    email: str = Form("")
    ):
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

            commands = salmonconfig.commands(indexpath, file_location, results_dir)
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
async def start_file(
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    token: str = Body(...),
    option: List[  str] = Body(...), 
    email: str = Body("")
):
    for panel in option:
        now = datetime.now()
        response = {'token': token,
                 'sample': filename,
                 'panel': panel.lower(),
                 'email': email,
                 'created_date': now }
        query = await ModelSample.create(**response)

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

def gather_tasks(commands_lst, session):
    tasks = []
    for commands in commands_lst:
        tasks.append(asyncio.create_task(session.post("http://salmon:80/", json = commands, ssl=False)))
    return tasks

# async def call_salmon(commands_lst):
#     results = [] 
#     session = aiohttp.ClientSession()
#     tasks = gather_tasks(commands_lst, session) 
#     responses = await asyncio.gather(*tasks)
#     for response in responses:
#         results.append(await response.json())
#     await session.close()  

from app.scripts import analyze

def analyze_handler(sample_name, headers, metadata, quant_dir):
    hits_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=True) 
    all_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=False) 
    coverage = analyze.coverage_cal(hits_df,all_df)
    pathogens, detected = analyze.detection(coverage)
    return analyze.d3_compatible_data(coverage, sample_name, analyze.df_to_dict(hits_df), analyze.df_to_dict(all_df), pathogens, detected)

async def call_salmon(commands_lst):
    session = aiohttp.ClientSession()
    for commands in commands_lst:
        await session.post("http://salmon:80/", json = commands, ssl=False)
    await session.close()

async def start_chunk_analysis(file_id, chunk_number, chosen_panel, commands_lst, sample_name, analyze_result, option):
    indexpath = os.path.join(INDEX_FOLDER, chosen_panel)

    chunk_dir =  "uploads/{}/{}.fastq".format(file_id, chunk_number)
    results_dir = "results/{}/{}".format(file_id, chunk_number)
    quant_dir = "results/{}/{}/quant.sf".format(file_id, chunk_number)

    commands = salmonconfig.commands(indexpath, chunk_dir, results_dir)  
    commands_lst.append(commands) 
    await call_salmon(commands_lst)

    metadata = analyze.metadata_load(METADATA_FOLDER, option)
    headers=['Name', 'TPM'] 
    analyze_result.append(analyze_handler(sample_name, headers, metadata, quant_dir)) 

@router.post("/upload-chunk")
async def upload_chunk(
    background_tasks: BackgroundTasks,
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    token: str = Form(...),
):  
    # query = await ModelSample.get_token(token)  
    # panel = query['panel']
    # chosen_panel = str(panel.lower()) + "_index"
    panel = "bacterial"
    chosen_panel = "bacterial_index"
    sample_name = "test"
    indexpath = os.path.join(INDEX_FOLDER, chosen_panel) 
    chunk_dir =  "uploads/{}/{}.fastq".format(file_id, chunk_number)
    results_dir = "results/{}/{}".format(file_id, chunk_number) 
    
    if chunk_number > 0:
        content_before = None
    async with aiofiles.open(chunk_dir, 'wb') as f:
        #while content := await chunk_file.read(memory_batch_size):
        content = await chunk_file.read()
        start_location = content.index("@".encode("utf8"))

        content_before = content[:start_location]
        content_after = content[start_location:]

        await f.write(content_after)
    if chunk_number > 0:
        prev_chunk_dir = "uploads/{}/{}.fastq".format(file_id, chunk_number-1)
        async with aiofiles.open(prev_chunk_dir, 'ab') as f:
            f.write(content_before)

    num_chunks = None
    with open("uploads/{}/meta.txt".format(file_id)) as f:
        num_chunks = int(f.readlines()[1])

    analyze_result = []
    if chunk_number > 0: 
        background_tasks.add_task(start_chunk_analysis, file_id, chunk_number-1, chosen_panel, [], sample_name, analyze_result, panel)

    if chunk_number + 1 == num_chunks:
        background_tasks.add_task(start_chunk_analysis, file_id, chunk_number, chosen_panel, [], sample_name, analyze_result, panel)
    
    print(analyze_result)
    return {"Result": "OK"}
    
# @router.post("/upload-chunk")
# async def upload_chunk(
#     background_tasks: BackgroundTasks,
#     chunk_number: int = Form(...),
#     file_id: str = Form(...),
#     chunk_file: UploadFile = File(...),
#     token: str = Form(...),
# ):
#     async with aiofiles.open("uploads/{}/{}.fastq".format(file_id, chunk_number), 'wb') as f:
#         while content := await chunk_file.read(chunk_size):
#             await f.write(content)

#     num_chunks = None
#     with open("uploads/{}/meta.txt".format(file_id)) as f:
#         num_chunks = int(f.readlines()[1])

#     if chunk_number + 1 == num_chunks:
#         background_tasks.add_task(
#             start_final_chunk_analysis, file_id, chunk_number)
#     else:
#         background_tasks.add_task(start_chunk_analysis, file_id, chunk_number)

#     return {"Result": "OK"}


# def start_final_chunk_analysis(file_id, chunk_number):
#     start_chunk_analysis(file_id, chunk_number)
#     finish_file_analysis(file_id)




    # dist = []

    # with open("uploads/{}/{}.fastq".format(file_id, chunk_number)) as f:
    #     while content := f.read(chunk_size):
    #         chunk_dist = analyze(content)
    #         dist.append(chunk_dist)

    # dist = pd.DataFrame(dist).sum()
    # dist.to_csv("results/{}/{}.txt".format(file_id, chunk_number), sep='\t')

    # os.remove("uploads/{}/{}.fastq".format(file_id, chunk_number))


# def finish_file_analysis(file_id):
#     dist = []

#     num_chunks = None
#     with open("uploads/{}/meta.txt".format(file_id)) as f:
#         num_chunks = int(f.readlines()[1])

#     for i in range(num_chunks):
#         chunk_dist = pd.read_csv(
#             "results/{}/{}.txt".format(file_id, i), sep='\t')["0"]
#         dist.append(chunk_dist)

#     dist = pd.DataFrame(dist)
#     dist = dist.sum()

#     dist.to_csv("results/{}/final.csv".format(file_id))


# @router.get("/results/{file_id}")
# async def get_results(file_id: str):
#     if not os.path.isfile("results/{}/final.csv".format(file_id)):
#         return 404

#     dist = pd.read_csv("results/{}/final.csv".format(file_id))

#     return {"Results": dist.to_dict()}
