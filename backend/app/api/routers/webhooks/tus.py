from fastapi import APIRouter, HTTPException, Request, status

from app.celery.tasks import move_data

router = APIRouter()


@router.post("/")
async def tusd(
    request: Request,
):
    hook_name = request.headers.get("hook-name")
    request_body = await request.json()

    tus_data = request_body.get("Upload", {})
    tus_meta = tus_data.get("MetaData")
    sub_id, fname = (*(tus_meta.get(i) for i in ["sub_id", "filename"]),)

    if sub_id is None:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="Missing required metadata",
        )

    if hook_name == "post-finish":
        file_id = tus_data.get("ID")
        move_data.delay(sub_id, file_id, fname)  # type: ignore

    return 200
