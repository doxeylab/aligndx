# python libraries
import os, asyncio, importlib, json
from typing import Optional
import pandas as pd 
from pydantic import BaseModel

# FastAPI
from fastapi import APIRouter, Depends, status
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 
from fastapi import Cookie, Query

# auth components
from app.auth.models import UserDTO
from app.auth.auth_dependencies import get_current_user_ws

# db components
from app.db.models import Sample as ModelSample
from app.db.schema import Sample as SchemaSample

# core scripts
from app.scripts import analyze, realtime 
from app.scripts.web_socket.manager import ConnectionManager

# celery
from app.celery import tasks

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

# -- Realtime upload results --

manager = ConnectionManager()

class Chunk_id(BaseModel):
    account_id: str 

@router.websocket('/livegraphs/{file_id}') 
async def live_graph_ws_endpoint(websocket: WebSocket, file_id: str):
    query = await ModelSample.get_sample_info(file_id) 
    file_id = str(query['id'])
    sample_name = query['sample_name']

    headers=['Name', 'TPM']
    data_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, "data.json")
 
    await manager.connect(websocket)
    token = await websocket.receive_text()
    current_user = await get_current_user_ws(token)

    if current_user:
        print(f"User {current_user.id} connected!")
        try:
            while True: 
                try:
                    stored_data = pd.read_json(data_dir, orient="table")
                except:
                    stored_data = None

                if stored_data is not None:
                    stored_data.set_index('Pathogen', inplace=True)
                    data = realtime.data_loader(stored_data, sample_name, headers, status="ready")
                    await manager.send_data(data, websocket)  
                    await asyncio.sleep(1) 
                
                else:
                    message = {"status": "pending"} 
                    await manager.send_data(message, websocket)
                    await asyncio.sleep(5)  

        except WebSocketDisconnect:
            manager.disconnect(websocket)
            print(f"User {current_user.id} disconnected!")

        except Exception as e: 
            raise e 
            print(f"Exception occured so client {current_user.id}  disconnected")
    else:
        manager.disconnect(websocket)  
        print(f"User could not be authenticated")