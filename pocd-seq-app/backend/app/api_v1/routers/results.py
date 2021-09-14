from fastapi import APIRouter 
import os
from datetime import datetime

from app.scripts import data_tb
# from app.db.database import database
from app.db.models import Sample as ModelSample
# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample



import json

RESULTS_FOLDER = './results'  

router = APIRouter()

@router.get("/results/{token}")
async def quantify_chunks(token: str): 
    category = 'NumReads'
    results = {}
    query = await ModelSample.get(token)  
    sample_name = query['sample']
    sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name) 
    # for subdir, dirs,files in os.walk(sample_dir): 
        # print(subdir, dirs, files)
        # for dir in dirs:  
    quant_dir = os.path.join(sample_dir,'quant.sf') 
    raw_df = data_tb.producedataframe(quant_dir,'NumReads')  
    hits_df = raw_df[raw_df.NumReads > 0]
    pathogen_hits =raw_df[raw_df.index.isin(sequences.values())]
    pathogen_biomarkers = raw_df[raw_df.index.isin(host_biomarkers.keys())]
    # sample_df = data_tb.producedataframe(quant_dir,category)
    # detected_pathogen = 'SARS-CoV-2'  
    
    # raw_table = data_tb.intojson(raw_df)
    hits_table = data_tb.intojson(hits_df)

    pathogen_table = data_tb.intojson(pathogen_hits)
    host_table = data_tb.intojson(pathogen_biomarkers)

    detection_result = data_tb.ispositive(raw_df) 
    result = {"sample": sample_name, 
              "detected": detection_result,\
              "pathogen": 'SARS-CoV-2',\
              "pathogen_hits": pathogen_table,\
              "host_hits": host_table,\
              "all_hits": hits_table}
    # results[dir] = result
    # return json.dumps(result)
    return result
    # if detection_result:
    #     return json.dumps(table, indent=4)
    # else:
    #     continue
    # results = {**table, **dict(zip(['sample_name', 'detected_pathogen',\
    #     'detection_result'],\
    #         [sample_name,detected_pathogen,\
    #             detection_result]))}
# return json.dumps(results, indent=4) 

@router.get('/panel_results/{token}') 
async def analyze_quants(token: str): 
    category = 'NumReads'
    results = {}
    query = await ModelSample.get(token)  
    sample_name = query['sample']
    sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name) 
    # for subdir, dirs,files in os.walk(sample_dir): 
        # print(subdir, dirs, files)
        # for dir in dirs:  
    quant_dir = os.path.join(sample_dir,'quant.sf') 
    raw_df = data_tb.producedataframe(quant_dir,'NumReads')  
    hits_df = raw_df[raw_df.NumReads > 0]
    pathogen_hits =raw_df[raw_df.index.isin(sequences.values())]
    pathogen_biomarkers = raw_df[raw_df.index.isin(host_biomarkers.keys())]
    # sample_df = data_tb.producedataframe(quant_dir,category)
    # detected_pathogen = 'SARS-CoV-2'  
    
    # raw_table = data_tb.intojson(raw_df)
    hits_table = data_tb.intojson(hits_df)

    pathogen_table = data_tb.intojson(pathogen_hits)
    host_table = data_tb.intojson(pathogen_biomarkers)

    detection_result = data_tb.ispositive(raw_df) 
    result = {"sample": sample_name, 
              "detected": detection_result,\
              "pathogen": 'SARS-CoV-2',\
              "pathogen_hits": pathogen_table,\
              "host_hits": host_table,\
              "all_hits": hits_table} 
    return result