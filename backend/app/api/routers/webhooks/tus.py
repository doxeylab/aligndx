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
    print(event)

    metadata = upload_info.get("MetaData")
    sub_id, fname = (*(metadata.get(i) for i in ["sub_id", "filename"]),)

    if sub_id is None:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="Missing required metadata",
        )

    if hook_name == "post-finish":
        file_id = upload_info.get("ID")
        move_data.delay(sub_id, file_id, fname)

    return JSONResponse(content={"detail": "Success"}, status_code=200)

