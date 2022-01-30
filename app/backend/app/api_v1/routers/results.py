# python libraries
import os, asyncio, importlib, json
from typing import List 
import pandas as pd 
from pydantic import BaseModel

# FastAPI
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user_no_exception

# db components
from app.db.models import Sample as ModelSample
from app.db.schema import Sample as SchemaSample

# core scripts
from app.scripts import analyze, realtime

# settings
from app.config.settings import get_settings

# config
app_settings = get_settings()
settings = app_settings.ResultSettings()

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

class Chunk_id(BaseModel):
    account_id: str

@router.websocket('/livegraphs/{token}') 
async def live_graph_ws_endpoint(websocket: WebSocket, token: str):
    query = await ModelSample.get_token(token) 
    file_id = str(query['id'])
    sample_name = query['sample']

    headers=['Name', 'TPM']
    get_current_chunk_task = importlib.import_module(
        "app.worker.tasks.get_curr_chunk"
    )
    await manager.connect(websocket)
    try:
        while True: 
            current_chunk = await get_current_chunk_task.agent.ask(Chunk_id(account_id=file_id).dict())

            if current_chunk:
                if current_chunk["chunk_number"] == current_chunk["total_chunks"]:
                    df = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
                    data = realtime.data_loader(df, sample_name, headers, status="complete")
                    await manager.send_data(data, websocket)  
                    manager.disconnect(websocket)
                else:
                    df = pd.DataFrame.from_dict(current_chunk["data"],orient="tight") 
                    data = realtime.data_loader(df, sample_name, headers, status="ready")
                    await manager.send_data(data, websocket) 
                    await asyncio.sleep(1)
            else:
                message = {"status": "pending"} 
                await manager.send_data(message, websocket)
                await asyncio.sleep(5)  

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"The Client #{token} disconnected") 

    except Exception as e: 
        print(e)
        print(f"Exception occured so client #{token} disconnected")
 
  