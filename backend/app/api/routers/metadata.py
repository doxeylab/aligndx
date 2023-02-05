
from fastapi import APIRouter 

from app.core.config.settings import settings
import pandas as pd 

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    return pd.read_json(settings.PIPELINES)