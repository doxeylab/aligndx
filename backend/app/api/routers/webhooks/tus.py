from http.client import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, HTTPException, Request
from fastapi import Depends

from app.services.auth import get_current_user
from app.models import submissions, auth
from app.models.pipelines import inputs

from app.services.db import get_db
from app.tasks import retrieve, update_metadata

router = APIRouter()


@router.post("/")
async def tusd(
    request: Request,
    current_user: auth.UserDTO = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    hook_name = request.headers.get("hook-name")
    request_body = await request.json()

    tus_data = request_body.get("Upload", {})
    tus_meta = tus_data.get("MetaData")
    sub_id, fname, input_id = (
        *(tus_meta.get(i) for i in ["sub_id", "filename", "input_id"]),
    )

    # Check to see if submission Id exists on metadata
    if sub_id == None or input_id == None:
        raise HTTPException(status_code=405, detail="Missing required metadata")
    metadata = retrieve.s(sub_id)()

    if hook_name == "post-finish":
        # Enqueue the Celery task to update metadata asynchronously
        file_id = tus_data.get("ID")
        update_metadata.apply_async(args=[sub_id, metadata])

    return 200
