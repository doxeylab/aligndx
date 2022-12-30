
from fastapi import APIRouter 

from app.config.settings import settings

import pandas as pd 

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    pipelines = pd.read_json(settings.PIPELINES)
    return pipelines