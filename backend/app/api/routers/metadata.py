import pandas as pd 
from fastapi import APIRouter 

router = APIRouter()

@router.get('/pipelines')
async def get_pipelines():
    pass 