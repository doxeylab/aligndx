import os, asyncio
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

from app.services.auth import get_current_user_ws
from app.services import web_socket
from app.models.submissions import SubmissionEntry

from app.core.db.dals.submissions import SubmissionsDal
from app.services.db import get_db
from app.celery.tasks import retrieve_metadata

router = APIRouter()

# -- chunked upload results --

manager = web_socket.manager.ConnectionManager()


class Chunk_id(BaseModel):
    account_id: str


@router.websocket("/livestatus/{sub_id}")
async def live_status(
    websocket: WebSocket, sub_id: str, db: AsyncSession = Depends(get_db)
):
    await manager.connect(id=sub_id, websocket=websocket)

    token = await websocket.receive_text()
    current_user = await get_current_user_ws(token, db)

    sub_dal = SubmissionsDal(db)
    query = await sub_dal.get_submission(current_user.id, sub_id)

    if query is None:
        raise WebSocketDisconnect()

    submission = SubmissionEntry.from_orm(query)

    if current_user and submission is not None:
        try:
            while True:
                metadata = retrieve_metadata(sub_id)

                if metadata is None:
                    manager.disconnect(id=sub_id)
                    return

                await manager.send_data(data=metadata.dict(), id=sub_id)

                if metadata.status == "completed" or metadata.status == "error":
                    manager.disconnect(id=sub_id)
                    return

                if metadata.status == "uploading" or metadata.status == "setup":
                    await asyncio.sleep(1)
                    continue

                if metadata.status == "analyzing":
                    await asyncio.sleep(1)
                    continue

        except WebSocketDisconnect:
            manager.disconnect(id=sub_id)
            print(f"User {current_user.id} disconnected!")

        except Exception as e:
            print(f"Exception occured so client {current_user.id}  disconnected")
            raise e
    else:
        manager.disconnect(websocket)
        print(f"User could not be authenticated")
