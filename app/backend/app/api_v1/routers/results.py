from fastapi import APIRouter, Depends
import os
from datetime import datetime
from app.api_v1.routers.users import User, get_current_user_no_exception

from app.scripts import data_tb, analyze, realtime

# from app.db.database import database
from app.db.models import Sample as ModelSample

# from app.db.models import create, get
from app.db.schema import Sample as SchemaSample

# sequences = {
#     "lcl|NC_045512.2_cds_YP_009725255.1_12": "ORF10",
#     "lcl|NC_045512.2_cds_YP_009724397.2_11": "nucleocapsid phosphoprotein",
#     "lcl|NC_045512.2_cds_YP_009725295.1_2": "ORF1a",
#     "lcl|NC_045512.2_cds_YP_009725318.1_9": "ORF7b",
#     "lcl|NC_045512.2_cds_YP_009724389.1_1": "ORF1ab",
#     "lcl|NC_045512.2_cds_YP_009724391.1_4": "ORF3a",
#     "lcl|NC_045512.2_cds_YP_009724392.1_5": "envelope",
#     "lcl|NC_045512.2_cds_YP_009724393.1_6": "membrane",
#     "lcl|NC_045512.2_cds_YP_009724390.1_3": "surface",
#     "lcl|NC_045512.2_cds_YP_009724394.1_7": "ORF6",
#     "lcl|NC_045512.2_cds_YP_009724396.1_10": "ORF8",
#     "lcl|NC_045512.2_cds_YP_009724395.1_8": "ORF7a",
# } 

import json

UPLOAD_FOLDER = './uploads' 
RESULTS_FOLDER = './results'
INDEX_FOLDER = './indexes' 
METADATA_FOLDER = "./metadata"

STANDARD_UPLOADS = UPLOAD_FOLDER + '/standard'
STANDARD_RESULTS = RESULTS_FOLDER + '/standard'
REAL_TIME_UPLOADS = UPLOAD_FOLDER + '/real_time'
REAL_TIME_RESULTS = RESULTS_FOLDER + '/real_time' 

for dirname in (UPLOAD_FOLDER, RESULTS_FOLDER, STANDARD_UPLOADS, STANDARD_RESULTS,  REAL_TIME_UPLOADS, REAL_TIME_RESULTS):
    if not os.path.isdir(dirname):
        os.mkdir(dirname)


router = APIRouter()
 
def analyze_handler(sample_name, headers, metadata, quant_dir):
    hits_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=True) 
    all_df = analyze.expression_hits_and_misses(quant_dir, headers, metadata, hits=False) 
    coverage = analyze.coverage_cal(hits_df,all_df)
    pathogens, detected = analyze.detection(coverage)
    return analyze.d3_compatible_data(coverage, sample_name, analyze.df_to_dict(hits_df), analyze.df_to_dict(all_df), pathogens, detected)

@router.get('/results/{token}') 
async def standard_results(token: str):   
    query = await ModelSample.get_token(token)  
    sample_name = query['sample']
    headers=['Name', 'TPM'] 
    panel = query['panel']
    file_id = str(query['id'])

# @router.get("/results/{token}")
# async def quantify_chunks(token: str):
#     category = "NumReads"
#     results = {}
#     query = await ModelSample.get_token(token)
#     sample_name = query['sample']
#     sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
#     # for subdir, dirs,files in os.walk(sample_dir):
#         # print(subdir, dirs, files)
#         # for dir in dirs:
#     quant_dir = os.path.join(sample_dir,'quant.sf')
#     raw_df = data_tb.producedataframe(quant_dir,'NumReads')
#     hits_df = raw_df[raw_df.NumReads > 0]
#     pathogen_hits =raw_df[raw_df.index.isin(sequences.values())]
#     pathogen_biomarkers = raw_df[raw_df.index.isin(host_biomarkers.keys())]
#     # sample_df = data_tb.producedataframe(quant_dir,category)
#     # detected_pathogen = 'SARS-CoV-2'

#     # raw_table = data_tb.intojson(raw_df)
#     hits_table = data_tb.intojson(hits_df)

#     pathogen_table = data_tb.intojson(pathogen_hits)
#     host_table = data_tb.intojson(pathogen_biomarkers)

#     detection_result = data_tb.ispositive(raw_df)
#     result = {
#         "sample": sample_name,
#         "detected": detection_result,
#         "pathogen": "SARS-CoV-2",
#         "pathogen_hits": pathogen_table,
#         "host_hits": host_table,
#         "all_hits": hits_table,
#     }


@router.get("/results/{token}")
async def analyze_quants(token: str, current_user: User = Depends(get_current_user_no_exception)):
    results = {}
    query = await ModelSample.get_token(token)
    sample_name = query["sample"]

    headers = ["Name", "TPM"]
    panel = query["panel"]
    metadata = analyze.metadata_load(METADATA_FOLDER, panel)
    sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name)
    quant_dir = os.path.join(sample_dir, "quant.sf")

    hits_df = analyze.expression_hits_and_misses(
        quant_dir, headers, metadata, hits=True
    )
    all_df = analyze.expression_hits_and_misses(
        quant_dir, headers, metadata, hits=False
    )
    coverage = analyze.coverage_cal(hits_df, all_df)
    pathogens, detected = analyze.detection(coverage)
    result = analyze.d3_compatible_data(
        coverage,
        sample_name,
        analyze.df_to_dict(hits_df),
        analyze.df_to_dict(all_df),
        pathogens,
        detected,
    )

    if current_user:
        await ModelSample.save_result(token, json.dumps(result), current_user.id)
    return result
