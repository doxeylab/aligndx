from fastapi import APIRouter 
from app.db.models import Sample as ModelSample
from app.config.settings import get_settings
from pydantic import BaseModel

app_settings = get_settings()
settings = app_settings.UploadSettings()

REAL_TIME_RESULTS = settings.REAL_TIME_RESULTS


router = APIRouter()

class SaveRequest(BaseModel):
    fileId: str

@router.post("/save_result")
async def save_result(saveRequest : SaveRequest):
    fileId = saveRequest.fileId
    results_dir = "{}/{}".format(REAL_TIME_RESULTS, fileId)
    data_dir = "{}/data.json".format(results_dir)

    await ModelSample.save_result(fileId, data_dir)
    print(saveRequest.fileId)
    return {"Result": "OK"}