from fastapi import APIRouter
from scripts import runsalmon, data_tb
import os

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes'
indexpath = os.path.join(INDEX_FOLDER, 'sars_with_human_decoys')

if not os.path.isdir(RESULTS_FOLDER):
    os.mkdir(RESULTS_FOLDER)
if not os.path.isdir(INDEX_FOLDER):
    os.mkdir(INDEX_FOLDER)

router = APIRouter()

@router.post("/results/")
async def quantify_chunks():
    chunk_dir = os.path.join(UPLOAD_FOLDER, 'chunks')
    for chunkfile in os.listdir(chunk_dir):
        chunk_file_name = chunkfile.split('.')[0]
        chunkfile_dir = os.path.join(chunk_dir, chunkfile) 
        results_dir = os.path.join(RESULTS_FOLDER, sample_name + '/' + chunk_file_name)
        runsalmon.quantify(chunk_file_name, indexpath, chunkfile_dir, results_dir ) 

    return {"run": "complete"}