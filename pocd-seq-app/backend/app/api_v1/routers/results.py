from fastapi import APIRouter 
import os
from datetime import datetime

from app.scripts import data_tb
# from app.db.database import database
from app.db.models import Sample as ModelSample
# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

sequences = {'lcl|NC_045512.2_cds_YP_009725255.1_12': 'ORF10',\
             'lcl|NC_045512.2_cds_YP_009724397.2_11': 'nucleocapsid phosphoprotein',\
             'lcl|NC_045512.2_cds_YP_009725295.1_2': 'ORF1a',\
             'lcl|NC_045512.2_cds_YP_009725318.1_9': 'ORF7b',\
             'lcl|NC_045512.2_cds_YP_009724389.1_1': 'ORF1ab',\
             'lcl|NC_045512.2_cds_YP_009724391.1_4': 'ORF3a',\
             'lcl|NC_045512.2_cds_YP_009724392.1_5': 'envelope',\
             'lcl|NC_045512.2_cds_YP_009724393.1_6': 'membrane',\
             'lcl|NC_045512.2_cds_YP_009724390.1_3': 'surface',\
             'lcl|NC_045512.2_cds_YP_009724394.1_7': 'ORF6',\
             'lcl|NC_045512.2_cds_YP_009724396.1_10': 'ORF8',\
             'lcl|NC_045512.2_cds_YP_009724395.1_8': 'ORF7a'}

host_biomarkers = {'ENST00000252519.7|ENSG00000130234.10|OTTHUMG00000193402.1|OTTHUMT00000055867.1|ACE2-201|ACE2|3393|protein_coding|' : 'ACE2',\
                   'ENST00000306602.2|ENSG00000169245.5|OTTHUMG00000160887.2|OTTHUMT00000362817.2|CXCL10-201|CXCL10|1176|protein_coding|' : 'CXCL10'
                   }

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
    sars_hits =raw_df[raw_df.index.isin(sequences.values())]
    sars_biomarkers = raw_df[raw_df.index.isin(host_biomarkers.keys())]
    # sample_df = data_tb.producedataframe(quant_dir,category)
    # detected_pathogen = 'SARS-CoV-2'  
    
    # raw_table = data_tb.intojson(raw_df)
    hits_table = data_tb.intojson(hits_df)

    pathogen_table = data_tb.intojson(sars_hits)
    host_table = data_tb.intojson(sars_biomarkers)

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
