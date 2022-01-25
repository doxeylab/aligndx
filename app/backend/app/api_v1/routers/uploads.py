import chunk
import sys
import math
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

from app.scripts import realtime 

read_batch_size = 4096
salmon_chunk_size = math.floor(4e6)
upload_chunk_size = 8e5
chunk_ratio = salmon_chunk_size / upload_chunk_size

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes' 
METADATA_FOLDER = "./metadata"

STANDARD_UPLOADS = UPLOAD_FOLDER + '/standard'
STANDARD_RESULTS = RESULTS_FOLDER + '/standard'
REAL_TIME_UPLOADS = UPLOAD_FOLDER + '/real_time'
REAL_TIME_RESULTS = RESULTS_FOLDER + '/real_time' 

for dirname in (UPLOAD_FOLDER, RESULTS_FOLDER, STANDARD_UPLOADS, STANDARD_RESULTS,  REAL_TIME_UPLOADS, REAL_TIME_RESULTS):
    if not os.path.isdir(dirname):
        os.mkdir(dirname)


router = APIRouter()

@router.get("/uploads/{token}")
async def fileretrieve(token: str):
    id = await ModelSample.get(token)
    print(id)
    return {'token': id} 

@router.post("/uploads")
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

            id = uuid4()
            file_id = str(id)
            now = datetime.now()
            response = {
                    'id': id,
                    'token': token,
                    'sample': sample_name,
                    'panel': option.lower(),
                    'email': email,
                    'created_date': now 
                       }
            query = await ModelSample.create(**response) 
    
            # for deleting
            sample_folder = os.path.join(STANDARD_UPLOADS, file_id)
            sample_dir = os.path.join(STANDARD_UPLOADS, file_id, sample_name)
    
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
            results_dir = os.path.join(STANDARD_RESULTS, file_id, sample_name) 

            commands = salmonconfig.commands(indexpath, file_location, results_dir)
            requests.post("http://salmon:80/", json = commands)
            shutil.rmtree(sample_folder)
            if email == "" or email == None: 
              pass
            else: 
              email_feature.send_email(email, sample_name)  

    return {"run": "complete"}

@router.post("/test_salmon_container")
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
        
        # it's worth noting that uuid4 generates random numbers, but the possibility of having a collision is so low, it's been estimated that it would take 90 years for such to occur.
 
        id = uuid4()
        file_id = str(id)
        now = datetime.now()
        response = {'token': token,
                 'sample': filename,
                 'id': id,
                 'panel': panel.lower(),
                 'email': email,
                 'created_date': now
                   }

        query = await ModelSample.create(**response)
        
        rt_dir = "{}/{}".format(REAL_TIME_UPLOADS ,file_id)
        os.mkdir(rt_dir)
        os.mkdir("{}/{}".format(rt_dir, "upload_data"))
        os.mkdir("{}/{}".format(rt_dir,"salmon_data"))

        
 
        with open("{}/meta.txt".format(rt_dir), 'w') as f:
            f.write(filename)
            f.write('\n')
            f.write(str(number_of_chunks))

        os.mkdir("{}/{}".format(REAL_TIME_RESULTS, file_id))

        return {"Result": "OK",
                "File_ID": file_id}

@router.post("/upload-chunk")
async def upload_chunk(
    background_tasks: BackgroundTasks,
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    panel: str = Form(...),
    token: str = Form(...)
):  

    rt_dir =  "{}/{}".format(REAL_TIME_UPLOADS, file_id) 
    upload_data=  "{}/{}/{}.fastq".format(rt_dir, "upload_data", chunk_number)
    upload_chunk_dir=  "{}/{}".format(rt_dir, "upload_data") 
    salmon_chunk_dir=  "{}/{}".format(rt_dir, "salmon_data") 
    

    async with aiofiles.open(upload_data, 'wb') as f:
        while content := await chunk_file.read(read_batch_size):
            await f.write(content)

    num_chunks = None
    with open("{}/meta.txt".format(rt_dir)) as f:
        num_chunks = int(f.readlines()[1])

    if chunk_number % math.floor(chunk_ratio) == 0 or chunk_number + 1 == num_chunks:
        background_tasks.add_task(process_salmon_chunks, upload_chunk_dir,salmon_chunk_dir, file_id, panel) 

    return {"Result": "OK"}

# async def real_time_pipeline(upload_chunk_dir,salmon_chunk_dir, file_id, panel):  
#     await process_salmon_chunks(upload_chunk_dir,salmon_chunk_dir, file_id, panel)


async def process_salmon_chunks(upload_chunk_dir, salmon_chunk_dir, file_id, panel):
    upload_chunk_nums = [int(fname.split('.')[0]) for fname in os.listdir(
        upload_chunk_dir) if fname.split('.')[0].isnumeric()]
    salmon_chunk_nums = [int(fname.split('.')[0]) for fname in os.listdir(
        salmon_chunk_dir) if fname.split('.')[0].isnumeric()] 

    chunks_to_assemble = range(max(salmon_chunk_nums) if len(salmon_chunk_nums) > 0 else 0,
                               math.ceil(max(upload_chunk_nums) / chunk_ratio) + 1)

    for salmon_chunk_num in chunks_to_assemble:
        start_num = math.ceil(salmon_chunk_num * chunk_ratio)
        end_num = math.ceil((salmon_chunk_num + 1) * chunk_ratio)

        upload_chunk_range = range(start_num, end_num)

        if set(upload_chunk_range).issubset(set(upload_chunk_nums)):
            await make_salmon_chunk(upload_chunk_dir, salmon_chunk_dir, salmon_chunk_num, upload_chunk_range)  
            # await start_chunk_analysis(salmon_chunk_dir, file_id, salmon_chunk_num, panel, [], chunks_to_assemble)

async def make_salmon_chunk(upload_data, salmon_data, salmon_chunk_number, upload_chunk_range):
    next_chunk_data = None

    async with aiofiles.open('{}/{}.fastq'.format(salmon_data, salmon_chunk_number), 'ab') as salmon_chunk: 
        fsize = 0
        for upload_chunk_number in upload_chunk_range:
            async with aiofiles.open('{}/{}.fastq'.format(upload_data, upload_chunk_number), 'rb') as upload_chunk:
                data = await upload_chunk.read()
                fsize += sys.getsizeof(data) 

                if fsize > salmon_chunk_size:
                    lines = data.decode('utf8').split('\n')
                    firstchars = [line[0] for indx, line in enumerate(
                        lines) if indx > 0 and indx < len(lines) - 1]

                    atsign_indices = [i for i, c in enumerate(firstchars) if c == '@']

                    for atsign_indx in atsign_indices:
                        if not all([atsign_indx + 4*i in atsign_indices for i in range(5)]):
                            atsign_indices.remove(atsign_indx)
                    atsign_linenum = atsign_indices[0] + 1

                    await salmon_chunk.write(
                        '\n'.join(
                            lines[:atsign_linenum]).encode('utf8'))
                    next_chunk_data = '\n'.join(
                        lines[atsign_linenum:]).encode('utf8')  
                else:
                    await salmon_chunk.write(data) 
    
    if next_chunk_data is not None:
        async with aiofiles.open('{}/{}.fastq'.format(salmon_data, salmon_chunk_number + 1), 'wb') as salmon_chunk:
            await salmon_chunk.write(next_chunk_data)
     
import logging

async def start_chunk_analysis(chunk_dir, file_id, chunk_number, panel, commands_lst, chunks_to_assemble):
    '''
    Note* This function cannot be run asynchronously due to the blocking implementation of long computation (salmon). Starlette (which is the underlying framework of FastApi) has implemented background tasks in a manner that is async. Since salmon is synchronous, this means it will block the event loop if implemented in async (which is why they are now no longer implemented via async). Therefore we are running salmon in the loops default executor. For Fastapi, this is threadpoolexecutor. 

    ''' 
    indexpath = os.path.join(INDEX_FOLDER, panel + "_index")

    chunk =  "{}/{}.fastq".format(chunk_dir, chunk_number)
    results_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, chunk_number)
    quant_dir = "{}/quant.sf".format(results_dir, chunk_number)

    commands = salmonconfig.commands(indexpath, chunk, results_dir)  
    commands_lst.append(commands) 

    loop = asyncio.get_event_loop()
    
    headers=['Name', 'NumReads']
    metadata = realtime.metadata_load(METADATA_FOLDER, panel) 

    # await call_salmon(commands_lst)
    await loop.run_in_executor(None, call_salmon, commands_lst, loop, headers, metadata, quant_dir, file_id, int(chunk_number), max(value for value in (chunks_to_assemble)))

    # call_salmon(commands_lst)
    # os.remove(chunk)
    
    # if os.path.isfile(quant_dir):
    # await stream_analyzer(headers, metadata, quant_dir, file_id, int(chunk_number), max(value for value in (chunks_to_assemble)))
    # else:
        # print(f'quant_dir does not exist yet for chunk {int(chunk_number)}')
  

# def gather_tasks(commands_lst, session):
#     tasks = []
#     for commands in commands_lst:
#         tasks.append(asyncio.create_task(session.post("http://salmon:80/", json = commands, ssl=False)))
#     return tasks

# async def call_salmon(commands_lst):
#     results = [] 
#     session = aiohttp.ClientSession()
#     tasks = gather_tasks(commands_lst, session) 
#     responses = await asyncio.gather(*tasks)
#     for response in responses:
#         results.append(await response.json())
#     await session.close()  

def call_salmon(commands_lst, loop, headers,metadata,quant_dir, file_id, chunk_number, chunks_to_assemble): 
    # session = aiohttp.ClientSession()
    # for commands in commands_lst:
    #     await session.post("http://salmon:80/", json = commands, ssl=False)
    # await session.close()
    with requests.Session() as s:
        for commands in commands_lst:
            s.post("http://salmon:80/", json = commands)
            asyncio.run_coroutine_threadsafe(stream_analyzer(headers,metadata,quant_dir, file_id, chunk_number, chunks_to_assemble), loop)

import importlib 
from pydantic import BaseModel

class Chunk(BaseModel):
    account_id: str
    chunk_number: int
    total_chunks: int
    data: dict
    
class Chunk_id(BaseModel):
    account_id: str
 

async def stream_analyzer(headers, metadata, quant_dir, file_id, chunk_number, chunks_to_assemble):
    get_current_chunk_task = importlib.import_module(
        "app.worker.tasks.get_curr_chunk"
    )
    increment_task = importlib.import_module(
        "app.worker.tasks.add_chunk",
    )  
    current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())

    # doesn't execute for some reason
    if current_chunk:
        # current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())
        current_chunk.pop("__faust") 

        print(f'Retrieving chunk {current_chunk["chunk_number"]}')
        print(f'Recieved data of type {type(current_chunk["data"])}')

        next_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata)
        previous_chunk = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
        print(realtime.coverage_summarizer(previous_chunk))

        accumulated_results = realtime.update_analysis(previous_chunk, next_chunk, 'NumReads')  
        accumulated_results['Coverage'] = realtime.coverage_calc(accumulated_results)
        
        data = accumulated_results.to_dict(orient="tight")

        task2 = await increment_task.agent.ask(Chunk(account_id=file_id, chunk_number=chunk_number, total_chunks=chunks_to_assemble, data=data).dict())
    else:
        first_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata) 
        first_chunk['Coverage'] = realtime.coverage_calc(first_chunk)
        data = first_chunk.to_dict(orient="tight")
        print(f'Adding data of type {type(data)}')
        task = await increment_task.agent.ask(Chunk(account_id=file_id, chunk_number=chunk_number, total_chunks=chunks_to_assemble, data=data).dict())
        print(f'Added chunk {task["chunk_number"]}')
        print(f'{type(task["data"])} was added') 
        
# def analyze_handler(headers, metadata, quant_dir, output_dir):
#     if os.path.isfile(output_dir):  
#         current_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata)
#         previous_chunk = pd.read_csv(output_dir, index_col='Pathogen')
#         accumulated_results = realtime.update_analysis(previous_chunk, current_chunk, 'NumReads')  
#         accumulated_results['Coverage'] = realtime.coverage_calc(accumulated_results) 
#         accumulated_results.to_csv(output_dir)
#     else:
#         first_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata) 
#         first_chunk['Coverage'] = realtime.coverage_calc(first_chunk)
#         first_chunk.to_csv(output_dir)
    
# def start_final_chunk_analysis(file_id, chunk_number):
#     start_chunk_analysis(file_id, chunk_number)
#     # finish_file_analysis(file_id)


# def start_chunk_analysis(file_id, chunk_number):
#     commands_lst = salmonconfig.commands(
#         sample='{}_{}'.format(file_id, chunk_number),
#         indexpath="indexes/bacterial_index",
#         filepath="chunks/{}/{}.fastq".format(
#             file_id, chunk_number),
#         resultspath="results/{}/{}".format(
#             file_id, chunk_number)
#     )

#     requests.post("http://localhost:8002/", json=commands_lst)

#     os.remove("chunks/{}/{}.fastq".format(file_id, chunk_number))


# @router.get("/results/{file_id}")
# async def get_results(file_id: str):
#     if not os.path.isfile("results/{}/final.csv".format(file_id)):
#         return 404

#     dist = pd.read_csv("results/{}/final.csv".format(file_id))

#     return {"Result": "OK"}  