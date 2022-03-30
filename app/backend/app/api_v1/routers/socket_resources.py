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
from app.celery.File import File

from app.celery import tasks
from app.scripts.post_processing.Output import StoredQuantData

from app.config.settings import settings

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
    file_dir = os.path.join(REAL_TIME_UPLOADS, file_id)
    data_obj = StoredQuantData(data_dir)

    if current_user:
        print(f"User {current_user.id} connected!")
        try:
            while True:
                if os.path.isdir(file_dir):
                    file = File.load(file_dir) 

                    stored_data = data_obj.load(sample_name, status="ready")     

                    if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
                        # all chunks completed, so disconnect websocket
                        stored_data = data_obj.load(sample_name, status="complete")     
                        await manager.send_data(stored_data, websocket)
                        manager.disconnect(websocket)
                        return

                    if stored_data:
                        await manager.send_data(stored_data, websocket)  
                        await asyncio.sleep(3) 

                    else:
                        message = {"status": "pending"} 
                        await manager.send_data(message, websocket)
                        await asyncio.sleep(5) 
                else:
                    # file doesn't exist, so close websocket
                    manager.disconnect(websocket)
                    return 

        except WebSocketDisconnect:
            manager.disconnect(websocket)
            print(f"User {current_user.id} disconnected!")

        except Exception as e: 
            raise e 
            print(f"Exception occured so client {current_user.id}  disconnected")
    else:
        manager.disconnect(websocket)  
        print(f"User could not be authenticated")