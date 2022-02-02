# python libraries
## system utils
import sys, os, shutil, math, traceback, importlib

## async
import aiofiles, asyncio 

## networking
import requests

## types
from uuid import uuid4
from datetime import datetime
from pydantic import BaseModel

## styling
from typing import List, Optional

## data manipulation
import pandas as pd

# FastAPI
from fastapi import APIRouter, BackgroundTasks, File, UploadFile, Form, Body
from fastapi import Depends

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user_no_exception

# core scripts
from app.scripts import email_feature, salmonconfig, realtime

# db
## from app.db.database import database
from app.db.models import Sample as ModelSample
from app.db.models import Logs as LogsModel

## from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

# settings 
from app.config.settings import get_settings

router = APIRouter()

# config
app_settings = get_settings()
settings = app_settings.UploadSettings()

read_batch_size = settings.read_batch_size
salmon_chunk_size = settings.salmon_chunk_size
upload_chunk_size = settings.upload_chunk_size
chunk_ratio = settings.chunk_ratio

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

# @router.get("/{token}")
# async def fileretrieve(token: str):
#     id = await ModelSample.get(token)
#     print(id)
#     return {'token': id} 

@router.post("/test_salmon_container")
async def ping_salmon():
    try:
        commands = {"commands": ["salmon"]}
        x = requests.post("http://salmon:80/", json = commands )
        print(x.text)
        return x.text 
    except Exception as e:
        return e


@router.post("/")
async def file_upload( 
    files: List[UploadFile] = File(...), 
    panel: List[str] = Form(...), 
    ): 

    for file in files:
        
        for option in panel:
            # get file name
            sample_name = file.filename.split('.')[0]
            chosen_panel = str(option.lower()) + "_index"

            id = uuid4()
            file_id = str(id)
            now = datetime.now()
            submission_type = "standard"
            response = {
                    'id': id,
                    'sample_name': sample_name,
                    'panel': option.lower(),
                    'created_date': now,
                    'submission_type': submission_type,
                       }

            query = await ModelSample.create_sample(**response) 
    
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

    return {"Result": "OK",
            "File_ID": file_id}

@router.post("/start-file")
async def start_file(
    current_user: UserDTO = Depends(get_current_user_no_exception),
    filename: str = Body(...),
    number_of_chunks: int = Body(...),
    panels: List[str] = Body(...)
):
    get_current_chunk_task = importlib.import_module(
        "app.worker.tasks.get_curr_chunk"
    )

    for option in panels:
        
        submission_type = "real-time"

        query = await ModelSample.does_file_exist(filename, current_user.id, submission_type)

        # sends restart policy if filename exists under users submissions
        if query:
            file_id = str(query["id"])
            current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())
            stop_point = current_chunk["chunk_number"]
            total_chunks = current_chunk["total_chunks"]

            # only sends restart message if chunks remain unprocessed
            if stop_point < total_chunks:

                print("User can restart!")
                return {"Result" : "Restart available",
                    "File_ID": file_id,
                    "Last_chunk_processed":  stop_point,
                    "Amount_processed": math.ceil(stop_point/total_chunks)}
        else:
            print("New submission")
    
        
        # it's worth noting that uuid4 generates random numbers, but the possibility of having a collision is so low, it's been estimated that it would take 90 years for such to occur.

        id = uuid4()
        file_id = str(id)
        now = datetime.now()
        response = {
                'id': id,
                'sample_name': filename,
                'panel': option.lower(),
                'created_date': now,
                'submission_type': submission_type,
                'user_id': current_user.id
                   }

        query = await ModelSample.create_sample(**response)
        
        rt_dir = "{}/{}".format(REAL_TIME_UPLOADS ,file_id)
        os.mkdir(rt_dir)
        os.mkdir("{}/{}".format(rt_dir, "upload_data"))
        os.mkdir("{}/{}".format(rt_dir,"salmon_data"))

        # subtracting 1 from salmon_chunks since it starts at 0
        with open("{}/meta.txt".format(rt_dir), 'w') as f:
            f.write(filename)
            f.write('\n')
            f.write(str(number_of_chunks))
            f.write('\n')
            f.write(str(math.ceil(number_of_chunks/chunk_ratio) - 1))

        os.mkdir("{}/{}".format(REAL_TIME_RESULTS, file_id))

        return {"Result": "OK",
                "File_ID": file_id}

@router.post("/upload-chunk")
async def upload_chunk(
    background_tasks: BackgroundTasks,
    current_user: UserDTO = Depends(get_current_user_no_exception),
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    panels: str = Form(...), 
):  

    rt_dir =  "{}/{}".format(REAL_TIME_UPLOADS, file_id) 
    upload_data=  "{}/{}/{}.fastq".format(rt_dir, "upload_data", chunk_number)
    upload_chunk_dir=  "{}/{}".format(rt_dir, "upload_data") 
    salmon_chunk_dir=  "{}/{}".format(rt_dir, "salmon_data") 
    
    if current_user:
        # keep returning until chunk number has reached where it left off
        # return {"Result": "Skipped"} 
        pass

    async with aiofiles.open(upload_data, 'wb') as f:
        while content := await chunk_file.read(read_batch_size):
            await f.write(content)

    num_chunks = None
    total_salmon_chunks = None
    with open("{}/meta.txt".format(rt_dir)) as f:
        data = f.readlines()
        num_chunks = int(data[1])
        total_salmon_chunks = int(data[2])

    if chunk_number % math.floor(chunk_ratio) == 0 or chunk_number + 1 == num_chunks:
        background_tasks.add_task(process_salmon_chunks, upload_chunk_dir,salmon_chunk_dir, file_id, panels, total_salmon_chunks) 

    logs = await LogsModel.log_upload(
        submission_id = file_id,
        start_kilobytes = math.ceil(chunk_number * upload_chunk_size / 1024),
        size_kilobytes = math.ceil(upload_chunk_size / 1024),
        creation_time = datetime.now()
    )    

    return {"Result": "OK"} 

async def process_salmon_chunks(upload_chunk_dir, salmon_chunk_dir, file_id, panel, total_chunks):
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
            await start_chunk_analysis(salmon_chunk_dir, file_id, salmon_chunk_num, panel, [], total_chunks, upload_chunk_dir)

            affected_uploads = await LogsModel.get_uploads_in_range(
                file_id,
                math.ceil(salmon_chunk_num * salmon_chunk_size / 1024),
                math.ceil(salmon_chunk_size / 1024)
            )
            for upload in affected_uploads:
                await LogsModel.log_deletion(
                    upload_id = upload.get('id'),
                    deletion_time = datetime.now()
                )

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
            os.remove('{}/{}.fastq'.format(upload_data, upload_chunk_number))
    
    if next_chunk_data is not None:
        async with aiofiles.open('{}/{}.fastq'.format(salmon_data, salmon_chunk_number + 1), 'wb') as salmon_chunk:
            await salmon_chunk.write(next_chunk_data)
     
async def start_chunk_analysis(chunk_dir, file_id, chunk_number, panel, commands_lst, total_chunks, upload_chunk_dir):
    '''
    Note* This function cannot be run asynchronously due to the blocking implementation of long computation (salmon). Starlette (which is the underlying framework of FastApi) has implemented background tasks in a manner that is async. Since salmon is synchronous, this means it will block the event loop if implemented in async (which is why they are now no longer implemented via async). Therefore we are running salmon in the loops default executor. For Fastapi, this is threadpoolexecutor. 

    ''' 
    indexpath = os.path.join(INDEX_FOLDER, panel + "_index")

    chunk =  "{}/{}.fastq".format(chunk_dir, chunk_number)
    results_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, chunk_number)
    quant_dir = "{}/quant.sf".format(results_dir, chunk_number)
    upload_dir = "{}/*".format(upload_chunk_dir)

    commands = salmonconfig.commands(indexpath, chunk, results_dir)  
    commands_lst.append(commands) 

    loop = asyncio.get_running_loop()
    
    headers=['Name', 'TPM']
    metadata = realtime.metadata_load(METADATA_FOLDER, panel)  

    future = await loop.run_in_executor(None, call_salmon, commands_lst, loop, headers, metadata, quant_dir, file_id, int(chunk_number), int(total_chunks), chunk, upload_dir)  

def call_salmon(commands_lst, loop, headers, metadata, quant_dir, file_id, chunk_number, total_chunks, chunk_dir, upload_chunk_path):  

    with requests.Session() as s:
        for commands in commands_lst:
            s.post("http://salmon:80/", json = commands)
    os.remove(chunk_dir)

    future = asyncio.run_coroutine_threadsafe(stream_analyzer(headers,metadata,quant_dir, file_id, chunk_number, total_chunks, upload_chunk_path), loop)

    try:
        result = future.result()

    except asyncio.TimeoutError:
        print('The coroutine took too long, cancelling the task ...')
        future.cancel()

    except Exception as exc:
        print('The coroutine raised an  exception : {!r}'.format(exc))
        traceback.print_exception(*sys.exc_info())
        
    else:
        print('The coroutine returned: {!r}'.format(result))



class Chunk(BaseModel):
    account_id: str
    chunk_number: int
    total_chunks: int
    data: dict
    
class Chunk_id(BaseModel):
    account_id: str
 

async def stream_analyzer(headers, metadata, quant_dir, file_id, chunk_number, total_chunks, upload_chunk_path):
    get_current_chunk_task = importlib.import_module(
        "app.worker.tasks.get_curr_chunk"
    )
    increment_task = importlib.import_module(
        "app.worker.tasks.add_chunk",
    )  
    current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())

    if current_chunk:
        print(f'Retrieving chunk {current_chunk["chunk_number"]}') 

        # read data from previous quant file; already has coverage
        previous_chunk = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
        print(realtime.coverage_summarizer(previous_chunk, headers))

        # read data from quant file and calculate coverage
        next_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata)
        next_chunk['Coverage'] = realtime.coverage_calc(next_chunk, headers[1])

        accumulated_results = realtime.update_analysis(previous_chunk, next_chunk, headers[1])  
        accumulated_results['Coverage'] = realtime.coverage_calc(accumulated_results, headers[1])
        
        print(realtime.coverage_summarizer(accumulated_results, headers))

        data = accumulated_results.to_dict(orient="tight")

        task = await increment_task.agent.ask(Chunk(account_id=file_id, chunk_number=chunk_number, total_chunks=total_chunks, data=data).dict())

        print(f'Added chunk {task["chunk_number"]} of {task["total_chunks"]}')

    else:
        first_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata) 
        first_chunk['Coverage'] = realtime.coverage_calc(first_chunk, headers[1])
        
        data = first_chunk.to_dict(orient="tight")
        task = await increment_task.agent.ask(Chunk(account_id=file_id, chunk_number=chunk_number, total_chunks=total_chunks, data=data).dict())
        
        print(f'Added chunk {task["chunk_number"]} of {task["total_chunks"]}')