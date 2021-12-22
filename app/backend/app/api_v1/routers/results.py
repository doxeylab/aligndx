from fastapi import APIRouter, WebSocket
import os
from datetime import datetime 

from app.scripts import data_tb, analyze, realtime

# from app.db.database import database
from app.db.models import Sample as ModelSample

# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

sequences = {
    "lcl|NC_045512.2_cds_YP_009725255.1_12": "ORF10",
    "lcl|NC_045512.2_cds_YP_009724397.2_11": "nucleocapsid phosphoprotein",
    "lcl|NC_045512.2_cds_YP_009725295.1_2": "ORF1a",
    "lcl|NC_045512.2_cds_YP_009725318.1_9": "ORF7b",
    "lcl|NC_045512.2_cds_YP_009724389.1_1": "ORF1ab",
    "lcl|NC_045512.2_cds_YP_009724391.1_4": "ORF3a",
    "lcl|NC_045512.2_cds_YP_009724392.1_5": "envelope",
    "lcl|NC_045512.2_cds_YP_009724393.1_6": "membrane",
    "lcl|NC_045512.2_cds_YP_009724390.1_3": "surface",
    "lcl|NC_045512.2_cds_YP_009724394.1_7": "ORF6",
    "lcl|NC_045512.2_cds_YP_009724396.1_10": "ORF8",
    "lcl|NC_045512.2_cds_YP_009724395.1_8": "ORF7a",
} 

import json

RESULTS_FOLDER = "./results"
METADATA_FOLDER = "./metadata"

router = APIRouter()
 
def analyze_handler(sample_name, headers, metadata, quant_dir):
    hits_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=True) 
    all_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=False) 
    coverage = analyze.coverage_cal(hits_df,all_df)
    pathogens, detected = analyze.detection(coverage)
    return analyze.d3_compatible_data(coverage, sample_name, analyze.df_to_dict(hits_df), analyze.df_to_dict(all_df), pathogens, detected)

@router.get('/results/{token}') 
async def analyze_quants(token: str):   
    query = await ModelSample.get_token(token)  
    sample_name = query['sample']
    headers=['Name', 'TPM'] 
    panel = query['panel']
    file_id = str(query['id'])
    metadata = analyze.metadata_load(METADATA_FOLDER, panel)
    sample_dir = os.path.join(RESULTS_FOLDER, file_id, sample_name) 
    quant_dir = os.path.join(sample_dir,'quant.sf')   
    return  analyze_handler(sample_name, headers, metadata, quant_dir)

@router.websocket('/livegraphs/{token}') 
async def live_graph_ws_endpoint(websocket: WebSocket, token: str):
    query = await ModelSample.get_token(token) 
    file_id = str(query['id'])
    output_dir = os.path.join(RESULTS_FOLDER, file_id, "out.csv")
    await websocket.accept()
    while True:
        await asyncio.sleep(1)
        data = await realtime.data_loader(output_dir)
        await websocket.json(data)

# import time 
# from watchdog.observers import Observer
# from watchdog.events import FileSystemEventHandler 

# class ProcessingHandler(FileSystemEventHandler):
#     def __init__(self, headers, metadata):
#         self.headers = headers
#         self.metadata = metadata 

#     def on_created(self,event):
#         chunk_path = event.src_path
#         quant_path = os.path.join(chunk_path,'quant.sf') 
#         sample_name = os.path.basename(os.path.dirname(quant_path))
#         # quants_lst = []
#         processed_quant = analyze_handler(sample_name, self.headers, self.metadata, quant_path)
#         print(processed_quant)
#         # if processed_quant['coverage'] !=0:
#         #     quants_lst.append(processed_quant)
#         #     return  quants_lst
#         # else:
#         #     pass

# @router.get('/quickdetect/{token}') 
# async def quick_detect(token: str): 
#     query = await ModelSample.get_token(token)   
#     sample_name = query['sample']
#     sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name, "chunks")   
#     panel = query['panel']
#     metadata = analyze.metadata_load(METADATA_FOLDER, panel)
#     headers=['Name', 'TPM'] 
#     path = sample_dir

#     event_handler = ProcessingHandler(headers, metadata)
#     observer = Observer()
#     observer.schedule(event_handler, path, recursive=True)  
#     observer.start()
#     try:
#         while True:
#             time.sleep(1)
#     finally:
#         observer.stop() 
#         observer.join() 


