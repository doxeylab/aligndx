import os, asyncio, importlib, json
from typing import Optional
import pandas as pd 
from pydantic import BaseModel

from fastapi import APIRouter, Depends, status
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 

from app.auth.auth_dependencies import get_current_user_ws
from app.models.schemas.submissions import SubmissionSchema

from app.db.dals.users import UsersDal 
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.scripts import analyze, realtime 
from app.scripts.web_socket.manager import ConnectionManager

from app.celery import tasks

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
async def live_graph_ws_endpoint(websocket: WebSocket, file_id: str, db: AsyncSession = Depends(get_db)):
    await manager.connect(websocket)
    token = await websocket.receive_text()
    current_user = await get_current_user_ws(token, db)
     
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, file_id)

    submission = SubmissionSchema.from_orm(query)
    sample_name = submission.name

    headers=['Name', 'TPM']
    data_dir = "{}/{}/{}".format(REAL_TIME_RESULTS, file_id, "data.json")
    meta_dir = "{}/{}/{}".format(REAL_TIME_UPLOADS, file_id, "meta.json")

    if current_user:
        print(f"User {current_user.id} connected!")
        try:
            while True:
                metadata = None
                with open(meta_dir) as f:
                    metadata = json.load(f)
                analysis_chunks_processed = metadata['analysis_chunks_processed']
                total_analysis_chunks = metadata['total_analysis_chunks'] - 2

                if analysis_chunks_processed == (total_analysis_chunks):
                    manager.disconnect(websocket)
                    return

                try:
                    stored_data = pd.read_json(data_dir, orient="table")
                
                except:
                    stored_data = None

                if stored_data is not None:
                    stored_data.set_index('Pathogen', inplace=True)
                    data = realtime.data_loader(stored_data, sample_name, headers, status="ready")
                    data['progress'] = analysis_chunks_processed/total_analysis_chunks
                    await manager.send_data(data, websocket)  
                    await asyncio.sleep(3) 
                
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