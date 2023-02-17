from fastapi import APIRouter 
from app.services.factory import get_available_pipelines

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    return get_available_pipelines()