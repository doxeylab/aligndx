import os, asyncio
from pydantic import BaseModel

from fastapi import APIRouter, Depends 
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 

from app.auth.auth_dependencies import get_current_user_ws
from app.models.schemas.submissions import SubmissionSchema

from app.db.dals.users import UsersDal 
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.scripts.web_socket.manager import ConnectionManager
from app.celery.tasks import retrieve

from app.config.settings import settings

UPLOAD_FOLDER = settings.UPLOAD_FOLDER
RESULTS_FOLDER = settings.RESULTS_FOLDER 

router = APIRouter() 

# -- chunked upload results --

manager = ConnectionManager()

class Chunk_id(BaseModel):
    account_id: str 

@router.websocket('/livestatus/{sub_id}') 
async def live_status(websocket: WebSocket, sub_id: str, db: AsyncSession = Depends(get_db)):
    await manager.connect(websocket)

    token = await websocket.receive_text()
    current_user = await get_current_user_ws(token, db)
     
    users_dal = UsersDal(db)
    query = await users_dal.get_submission(current_user.id, sub_id)

    submission = SubmissionSchema.from_orm(query)
    
    data = {"status": "", "processes": {}}
    if current_user and submission != None:
        try:
            while True:
                metadata = retrieve.s(sub_id)()

                if metadata == None:
                    manager.disconnect(websocket)
                    return
                
                data["status"] = metadata.status
                data["processes"] = metadata.processes
                
                await manager.send_data(data=data, websocket=websocket) 

                if metadata.status == 'completed' or metadata.status =='error':
                    manager.disconnect(websocket)
                    return 

                if metadata.status == 'uploading' or metadata.status == 'setup':
                    await asyncio.sleep(1) 
                    continue

                if metadata.status == 'analyzing':
                    await asyncio.sleep(1) 
                    continue

        except WebSocketDisconnect:
            manager.disconnect(websocket)
            print(f"User {current_user.id} disconnected!")

        except Exception as e: 
            print(f"Exception occured so client {current_user.id}  disconnected")
            raise e 
    else:
        manager.disconnect(websocket)  
        print(f"User could not be authenticated")
