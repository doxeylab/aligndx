from app.storages.storage_manager import StorageManager
from app.models.stores import BaseStores
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse
from app.celery.tasks import move_data

router = APIRouter()


@router.post("/")
async def tusd(
    request: Request,
):
    request_body = await request.json()
    hook_name = request_body.get("Type", "") 
    event = request_body.get("Event",{})
    upload_info = event.get("Upload",{})

    metadata = upload_info.get("MetaData")
    sub_id, fname = (*(metadata.get(i) for i in ["sub_id", "filename"]),)
    storage = StorageManager ()
    if sub_id is None:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="Missing required metadata",
        )

    if hook_name == "post-finish":
        file_id = upload_info.get("ID")
        move_data.delay(sub_id, file_id, fname)

    
    if hook_name == "post-terminate":
        file_id = upload_info.get("ID")
        storage.delete(BaseStores.UPLOADS, file_id)
        storage.delete(BaseStores.UPLOADS, f"{file_id}.info")
        storage.delete(BaseStores.UPLOADS, f"{file_id}.lock")


    return JSONResponse(content={"detail": "Success"}, status_code=200)

