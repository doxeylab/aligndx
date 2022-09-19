import os, asyncio
from pydantic import BaseModel

from fastapi import APIRouter, Depends, status
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 

from app.auth.auth_dependencies import get_current_user_ws
from app.flows.main import retrieve
from app.models.schemas.submissions import SubmissionSchema

from app.db.dals.users import UsersDal 
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.scripts.web_socket.manager import ConnectionManager
from app.scripts.process.controller import Controller
from app.flows.main import retrieve

from app.celery.File import File

from app.config.settings import settings

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER 

router = APIRouter() 

# -- chunked upload results --

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
    
    if current_user:
        print(f"User {current_user.id} connected!")
        try:
            while True:

                metadata = retrieve.fn(file_id)
                upload_progress = metadata.processed/(metadata.total + 1)
                analysis_progress = 0
                progress_data = {'analysis': analysis_progress, 'upload': upload_progress}


                if metadata.status == 'completed':
                    stored_data = metadata.data
                    stored_data['status'] = "complete"
                    stored_data['sample_name'] = submission.name
                    stored_data['progress'] = progress_data

                    await manager.send_data(stored_data, websocket) 
                    manager.disconnect(websocket)
                    return

                if metadata.status == 'analyzing':
                    stored_data['status'] = "ready"
                    stored_data['sample_name'] = submission.name
                    stored_data['progress'] = progress_data

                    await manager.send_data(stored_data, websocket)  
                    await asyncio.sleep(3) 
                
                if metadata.status == 'uploading' or metadata.status == 'setup':
                    resp = {'status': 'pending','sample_name':submission.name,'progress': progress_data}
                    await manager.send_data(resp, websocket)
                    await asyncio.sleep(5) 

                if metadata.status == 'error':
                    resp = {'status': 'error','sample_name':submission.name,'progress': progress_data}
                    await manager.send_data(resp, websocket)
                    manager.disconnect(websocket)
                    return
 
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