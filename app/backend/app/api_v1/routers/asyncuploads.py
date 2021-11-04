from fastapi import APIRouter, File, UploadFile
import time
from starlette.requests import Request
from starlette.responses import Response

router = APIRouter()


@router.post("/asyncuploadfiles/")
async def upload_file(file: UploadFile = File(...)):
    start = time.time()
    total = 0
    i = 0
    while True:
        content = await file.read(128 * 1024)
        if content == b"":
            break
        total += len(content)
        i += 1
        print(f"[{i:5}] {time.time() - start} {total} bytes")
