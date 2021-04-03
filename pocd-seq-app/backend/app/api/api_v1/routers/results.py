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

@router.post("/results/{token}")
async def quantify_chunks(token: str): 
    category = 'NumReads'
    results = {}
    query = await ModelSample.get(token)  
    sample_name = query['sample']
    sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
    for subdir, dirs,files in os.walk(sample_dir): 
        for dir in dirs: 
            quant_dir = os.path.join(sample_dir, dir,'quant.sf') 
            sample_df = data_tb.producedataframe(quant_dir,category)
            detected_pathogen = 'SARS-CoV-2' 
            table = data_tb.intojson(sample_df) 
            detection_result = data_tb.ispositive(sample_df) 
            result = {"table": table,\
                      "detection": detection_result}
            results[dir] = result
        return json.dumps(results)
            # if detection_result:
            #     return json.dumps(table, indent=4)
            # else:
            #     continue
            # results = {**table, **dict(zip(['sample_name', 'detected_pathogen',\
            #     'detection_result'],\
            #         [sample_name,detected_pathogen,\
            #             detection_result]))}
        # return json.dumps(results, indent=4) 