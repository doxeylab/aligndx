import os, asyncio
from pydantic import BaseModel

from fastapi import APIRouter, Depends, status
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect 

from app.auth.auth_dependencies import get_current_user_ws
from app.models.schemas.submissions import SubmissionSchema

from app.db.dals.users import UsersDal 
from app.services.db import get_db 
from sqlalchemy.ext.asyncio import AsyncSession

from app.scripts.web_socket.manager import ConnectionManager
from app.scripts.process.controller import Controller

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
    upload_dir = os.path.join(UPLOAD_FOLDER, file_id)
    results_dir = os.path.join(RESULTS_FOLDER, file_id)
    controller = Controller(process=submission.submission_type,panel=submission.panel,out_dir=results_dir)


    if current_user:
        print(f"User {current_user.id} connected!")
        try:
            while True:
                if os.path.isdir(upload_dir):
                    file = File.load(upload_dir) 

                    stored_data = controller.load_data() 
                    analysis_progress = len([chunk for chunk in file.state.analysis_chunks if chunk.status == 'Complete']) / len(file.state.analysis_chunks)
                    upload_progress = len([chunk for chunk in file.state.upload_chunks if chunk.status == 'Uploaded']) / len(file.state.upload_chunks)
                    progress_data = {'analysis': analysis_progress, 'upload': upload_progress}

                    if all([chunk.status == 'Complete' for chunk in file.state.analysis_chunks]):
                        # all chunks completed, so disconnect websocket
                        stored_data = controller.load_data()
                        stored_data['status'] = "complete"
                        stored_data['sample_name'] = submission.name
                        stored_data['progress'] = progress_data
                      
                        await manager.send_data(stored_data, websocket) 
                        manager.disconnect(websocket)
                        return

                    if stored_data:
                        stored_data['status'] = "ready"
                        stored_data['sample_name'] = submission.name
                        stored_data['progress'] = progress_data
    

                        await manager.send_data(stored_data, websocket)  
                        await asyncio.sleep(3) 

                    else:
                        resp = {'progress': progress_data, 'status': 'pending' }
                        await manager.send_data(resp, websocket)
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