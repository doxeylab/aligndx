import pandas as pd 
from fastapi import APIRouter 

from app.core.config.settings import settings

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    return pd.read_json(settings.PIPELINES)