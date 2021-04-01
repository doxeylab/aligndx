from fastapi import APIRouter 
import os
from datetime import datetime

from app.scripts import fqsplit, runsalmon
# from app.db.database import database
from app.db.models import Sample as ModelSample
# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes'
indexpath = os.path.join(INDEX_FOLDER, 'sars_with_human_decoys')

router = APIRouter()

@router.post("/results/{token}")
async def quantify_chunks(token: str): 
    chunk_dir = os.path.join(UPLOAD_FOLDER, 'chunks')
    for chunkfile in os.listdir(chunk_dir):
        chunk_file_name = chunkfile.split('.')[0]
        chunkfile_dir = os.path.join(chunk_dir, chunkfile) 
        results_dir = os.path.join(RESULTS_FOLDER, chunk_file_name)
        runsalmon.quantify(chunk_file_name, indexpath, chunkfile_dir, results_dir ) 
    return {"run": "complete"} 