from app.api_v1.routers.users import UserDTO, get_current_user_no_exception
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import os
import asyncio

from app.scripts import data_tb, analyze, realtime

# from app.db.database import database
from app.db.models import Sample as ModelSample

# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

import importlib 

# sequences = {
#     "lcl|NC_045512.2_cds_YP_009725255.1_12": "ORF10",
#     "lcl|NC_045512.2_cds_YP_009724397.2_11": "nucleocapsid phosphoprotein",
#     "lcl|NC_045512.2_cds_YP_009725295.1_2": "ORF1a",
#     "lcl|NC_045512.2_cds_YP_009725318.1_9": "ORF7b",
#     "lcl|NC_045512.2_cds_YP_009724389.1_1": "ORF1ab",
#     "lcl|NC_045512.2_cds_YP_009724391.1_4": "ORF3a",
#     "lcl|NC_045512.2_cds_YP_009724392.1_5": "envelope",
#     "lcl|NC_045512.2_cds_YP_009724393.1_6": "membrane",
#     "lcl|NC_045512.2_cds_YP_009724390.1_3": "surface",
#     "lcl|NC_045512.2_cds_YP_009724394.1_7": "ORF6",
#     "lcl|NC_045512.2_cds_YP_009724396.1_10": "ORF8",
#     "lcl|NC_045512.2_cds_YP_009724395.1_8": "ORF7a",
# } 

import json

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
 
def analyze_handler(sample_name, headers, metadata, quant_dir):
    hits_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=True) 
    all_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=False) 
    coverage = analyze.coverage_cal(hits_df,all_df)
    pathogens, detected = analyze.detection(coverage)
    return analyze.d3_compatible_data(coverage, sample_name, analyze.df_to_dict(hits_df), analyze.df_to_dict(all_df), pathogens, detected)

@router.get('/results/{token}') 
async def standard_results(token: str, current_user: UserDTO = Depends(get_current_user_no_exception)):   
    query = await ModelSample.get_token(token)  
    sample_name = query['sample']
    headers=['Name', 'TPM'] 
    panel = query['panel']
    file_id = str(query['id'])

    metadata = analyze.metadata_load(METADATA_FOLDER, panel)
    sample_dir = os.path.join(STANDARD_RESULTS, file_id, sample_name)
    quant_dir = os.path.join(sample_dir,'quant.sf')   
    result = analyze_handler(sample_name, headers, metadata, quant_dir)
    if current_user:
        await ModelSample.save_result(token, json.dumps(result), current_user.id)
    return result


@router.get('/rt-res-status/{token}')
async def standard_results(token: str):   
    query = await ModelSample.get_token(token) 
    file_id = str(query['id'])
    csv_dir = os.path.join(REAL_TIME_RESULTS, file_id, "out.csv")
    if os.path.isfile(csv_dir):
        return {"result": "ready"}
    else:
        return {"result": "pending"}

# async def check_status(csv_dir, sample_name):
#     if os.path.isfile(csv_dir):
#         return realtime.data_loader(csv_dir, sample_name)
#     else:
#         await asyncio.sleep(1)
#         check_status(csv_dir, sample_name)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_data(self, data: dict, websocket: WebSocket):
        await websocket.send_json(data)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# @router.websocket('/livegraphs/{token}') 
# async def live_graph_ws_endpoint(websocket: WebSocket, token: str):
#     query = await ModelSample.get_token(token) 
#     file_id = str(query['id'])
#     sample_name = query['sample']

#     results_dir = os.path.join(REAL_TIME_RESULTS, file_id) 

#     get_current_chunk_task = importlib.import_module(
#         "app.worker.tasks.get_curr_chunk"
#     )
#     await manager.connect(websocket)
#     try:
#         while True: 
#             current_chunk = await get_current_chunk_task.agent.ask(file_id)
#             current_chunk.pop("__faust")
#             print(current_chunk)

#             if not current_chunk:
#                 data = {"result": "pending"} 
#                 await manager.send_data(data, websocket)
#                 await asyncio.sleep(5) 

#             if current_chunk.chunk_number != current_chunk.total_chunks: 
#                 await manager.send_data(current_chunk, websocket) 
#                 await asyncio.sleep(1) 

#             else: 
#                 end_signal = {"result": "complete"} 
#                 await manager.send_data(end_signal, websocket)
#                 websocket.close() 

#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         await manager.broadcast(f"Client #{token} disconnected") 

 
# @router.websocket('/livegraphs/{token}') 
# async def live_graph_ws_endpoint(websocket: WebSocket, token: str):
#     query = await ModelSample.get_token(token) 
#     file_id = str(query['id'])
#     sample_name = query['sample']

#     results_dir = os.path.join(REAL_TIME_RESULTS, file_id)
#     uploads_dir = os.path.join(REAL_TIME_UPLOADS, file_id) 
#     chunk_dir = os.path.join(uploads_dir, "chunk_data")
#     csv_dir = os.path.join(results_dir, "out.csv")

#     with open("{}/{}/meta.txt".format(REAL_TIME_UPLOADS, file_id)) as f:
#         num_chunks = int(f.readlines()[1]) 

#     await websocket.accept()
#     while True: 
#         await asyncio.sleep(1)
#         # if os.path.isfile(csv_dir):
#             # data = realtime.data_loader(csv_dir, sample_name)
#         # data = {"test": "t1",
#         #         "follow" : "t2"}
#         await websocket.send_json(data) 
        
