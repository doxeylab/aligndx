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

        os.mkdir("{}/{}".format(REAL_TIME_UPLOADS ,file_id))
        with open("{}/{}/meta.txt".format(REAL_TIME_UPLOADS, file_id), 'w') as f:
            f.write(filename)
            f.write('\n')
            f.write(str(number_of_chunks))
        os.mkdir("{}/{}".format(REAL_TIME_RESULTS, file_id))

        return {"Result": "OK",
                "File_ID": file_id}

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


def call_salmon(commands_lst):
    # session = aiohttp.ClientSession()
    # for commands in commands_lst:
    #     await session.post("http://salmon:80/", json = commands, ssl=False)
    # await session.close()
    with requests.Session() as s:
        for commands in commands_lst:
            s.post("http://salmon:80/", json = commands)

from app.scripts import realtime 

def analyze_handler(headers, metadata, quant_dir, output_dir):
    if os.path.isfile(output_dir):  
        current_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata)
        previous_chunk = pd.read_csv(output_dir, index_col='Pathogen')
        accumulated_results = realtime.update_analysis(previous_chunk, current_chunk, 'NumReads')  
        accumulated_results['Coverage'] = realtime.coverage_calc(accumulated_results) 
        accumulated_results.to_csv(output_dir)
    else:
        first_chunk = realtime.realtime_quant_analysis(quant_dir, headers, metadata) 
        first_chunk['Coverage'] = realtime.coverage_calc(first_chunk)
        first_chunk.to_csv(output_dir)
    
def start_chunk_analysis(file_id, chunk_number, chosen_panel, commands_lst, sample_name, option):
    '''
    file_id : 
    chunk_number:
    chosen_panel: 
    commands_lst: 
    sample_name:
    analyze_result:
    option:

    Note* This function cannot be run asynchronously due to the blocking implementation of long computation (salmon). Starlette (which is the underlying framework of FastApi) has implemented background tasks in a manner that is async. Since salmon is synchronous, this means it will block the event loop if implemented in async (which is why they are now no longer implemented via async).

    '''
    indexpath = os.path.join(INDEX_FOLDER, chosen_panel)

    chunk_dir =  "{}/{}/{}/{}.fastq".format(REAL_TIME_UPLOADS, file_id, "chunk_data", chunk_number)
    results_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, chunk_number)
    quant_dir = "{}/{}/{}/quant.sf".format(REAL_TIME_RESULTS, file_id, chunk_number)

    commands = salmonconfig.commands(indexpath, chunk_dir, results_dir)  
    commands_lst.append(commands) 

    # await call_salmon(commands_lst)
    call_salmon(commands_lst)

    if os.path.isfile(quant_dir):
        metadata = realtime.metadata_load(METADATA_FOLDER, option)
        headers=['Name', 'NumReads']
        output_dir = os.path.join(REAL_TIME_RESULTS, file_id, "out.csv")
        analyze_handler(headers, metadata, quant_dir, output_dir) 
    else:
        pass

@router.post("/upload-chunk")
async def upload_chunk(
    background_tasks: BackgroundTasks,
    chunk_number: int = Form(...),
    file_id: str = Form(...),
    chunk_file: UploadFile = File(...),
    token: str = Form(...)
):  
    # query = await ModelSample.get_token(token)  
    # panel = query['panel']
    # chosen_panel = str(panel.lower()) + "_index"
    panel = "bacterial"
    chosen_panel = "bacterial_index"
    sample_name = "test"
    indexpath = os.path.join(INDEX_FOLDER, chosen_panel) 
    chunk_dir =  "{}/{}/{}/{}.fastq".format(REAL_TIME_UPLOADS, file_id, "chunk_data", chunk_number)
    results_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, chunk_number) 
    
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
        prev_chunk_dir = "{}/{}/{}/{}.fastq".format(REAL_TIME_UPLOADS, file_id, "chunk_data", chunk_number-1) 
        async with aiofiles.open(prev_chunk_dir, 'ab') as f:
            f.write(content_before)

    num_chunks = None
    
    with open("{}/{}/meta.txt".format(REAL_TIME_UPLOADS, file_id)) as f:
        num_chunks = int(f.readlines()[1])
 
    if chunk_number > 0:  
        background_tasks.add_task(start_chunk_analysis, file_id, chunk_number-1, chosen_panel, [], sample_name, panel)

    if chunk_number + 1 == num_chunks: 
        background_tasks.add_task(start_chunk_analysis, file_id, chunk_number, chosen_panel, [], sample_name, panel) 

    return {"Result": "OK"}  