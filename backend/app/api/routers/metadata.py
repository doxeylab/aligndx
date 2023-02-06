import pandas as pd 
from fastapi import APIRouter 

from app.core.config.settings import settings
from app.services.pipelines import get_available_pipelines

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    return get_available_pipelines()