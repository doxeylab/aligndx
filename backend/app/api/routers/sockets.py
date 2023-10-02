import os, asyncio
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends 
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 

from app.services.auth import get_current_user_ws
from app.services import web_socket
from app.models import submissions
from app.models.redis import MetaModel
from app.core.db.dals.submissions import SubmissionsDal
from app.services.db import get_db 
from app.celery.tasks import retrieve_metadata
from app.models.status import SubmissionStatus

router = APIRouter() 

# -- chunked upload results --

manager = web_socket.manager.ConnectionManager()

class Chunk_id(BaseModel):
    account_id: str
    
MAX_RETRIES=3

@router.websocket('/livestatus/{sub_id}') 
async def live_status(websocket: WebSocket, sub_id: str, db: AsyncSession = Depends(get_db)):
    await manager.connect(id=sub_id, websocket=websocket)

    token = await websocket.receive_text()
    current_user = await get_current_user_ws(token, db)
     
    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)

    if query is None:
        raise WebSocketDisconnect()

    submission = submissions.Entry.from_orm(query)
    
    if current_user and submission != None:
        try:
            retries = 0
            while True:
                try:
                    meta = retrieve_metadata(sub_id)
                    if not meta:
                        raise ValueError("Metadata is None")
                    
                    metadata = MetaModel(**meta)
                    await manager.send_data(data=meta, id=sub_id)

                except Exception as e:
                    retries += 1
                    if retries > MAX_RETRIES:
                        print(f"Max retries reached for client {current_user.id}. Disconnecting...")
                        break
                    
                    # await manager.send_data(data={"status": "pending", "message": str(e)}, id=sub_id)
                    await asyncio.sleep(5)
                    continue
                
                await manager.send_data(data=meta, id=sub_id) 

                sleep_time = {
                    SubmissionStatus.PROCESSING: 10,
                    SubmissionStatus.QUEUED: 20,
                    SubmissionStatus.CREATED: 30,
                    
                }.get(metadata.status, 5)

                if metadata.status == SubmissionStatus.COMPLETED or metadata.status == SubmissionStatus.ERROR:
                    manager.disconnect(id=sub_id)
                    break

                await asyncio.sleep(sleep_time)

        except WebSocketDisconnect:
            manager.disconnect(id=sub_id)
            print(f"User {current_user.id} disconnected!")

        except Exception as e: 
            print(f"Exception occured so client {current_user.id}  disconnected")
            raise e 
    else:
        manager.disconnect(websocket)  
        print(f"User could not be authenticated")
