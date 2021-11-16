from fastapi import APIRouter
import os
from datetime import datetime
import pandas as pd
import numpy as np

from app.scripts import data_tb

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

host_biomarkers = {
    "ENST00000252519.7|ENSG00000130234.10|OTTHUMG00000193402.1|OTTHUMT00000055867.1|ACE2-201|ACE2|3393|protein_coding|": "ACE2",
    "ENST00000306602.2|ENSG00000169245.5|OTTHUMG00000160887.2|OTTHUMT00000362817.2|CXCL10-201|CXCL10|1176|protein_coding|": "CXCL10",
}

import json

RESULTS_FOLDER = "./results"
METADATA_FOLDER = "./metadata"

router = APIRouter()


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
 

def grab_id(id, prefix, strip): 
  if type(id) == str:
    x = id.split(" ")   
    for names in x: 
      if names.startswith(prefix):
        return (names.strip(strip)) 

def metadata_load(panel): 
  metadata_path = os.path.join(METADATA_FOLDER, panel + "_metadata.csv")
  metadata = pd.read_csv(metadata_path, sep=";")
  metadata = metadata.applymap(lambda x: grab_id(x,prefix=">lcl|", strip=">")) 
  metadata = metadata[~metadata.isnull()]  
  metadata = metadata.apply(lambda x: pd.Series(x.dropna().values))
  metadata = metadata.fillna('')   
  return metadata
 

def expression_hits_and_misses(sample_name, headers, metadata, hits):
  sample = pd.read_csv(sample_name, sep="\t") 
  sample = sample.loc[:, sample.columns.isin(headers)]  
  sample = sample.dropna()     
  
  df_list = []
  for col in metadata:
    sample['Name'] = sample[sample['Name'].isin(metadata[col])]
    sample = sample.dropna()       
    sample = sample.reset_index(drop=True)  

    mask_cols = sample.select_dtypes(include=['float64']).columns 

    if hits == True:   
      mask = sample[mask_cols] > 0  
      sample[mask_cols] = sample[mask_cols][mask]
      sample = sample.apply(lambda x: pd.Series(x.dropna().values))
      sample = sample.dropna() 
      sample[sample.select_dtypes(include=['float64']).columns] = sample.select_dtypes(include=['float64']).apply(lambda x: x.apply('{:.2f}'.format)) 
    else:
      pass

    col_list = list(zip([col]*len(headers), headers)) 

    new_df = sample.copy() 
    cols = pd.MultiIndex.from_tuples(col_list)
    new_df.columns = cols  
    
    df_list.append(new_df)
  matches_df = pd.concat(df_list, axis=1, join="outer") 
  matches_df = matches_df.apply(lambda x: pd.Series(x.fillna('').values)) 
  return matches_df 

def df_to_dict(df):
  col_titles = list(set(df.columns.get_level_values(0)))
  df_list = []
  for col in col_titles:
    pathogen_df = {}
    data = df[col].set_index("Name").to_dict()
    pathogen_df[col] = data
    df_list.append(pathogen_df)
  return df_list

def coverage_cal(hits, all):
  hits = hits.loc[:, (slice(None), ["Name"])].apply(np.count_nonzero)
  all = all.loc[:, (slice(None), ["Name"])].apply(np.count_nonzero) 

  coverage = hits/all * 100   
  coverage = coverage.apply('{:.2f}'.format) 

  coverage = coverage.to_frame()
  coverage.rename(columns={0:"coverage"}, inplace=True)
  coverage.index =coverage.index.get_level_values(0)
  coverage['coverage'] = coverage['coverage'].astype('float')
  # coverage = coverage.apply(lambda x: pd.Series(x.fillna('').values)) 
    
  coverage = coverage.fillna(0)  
  return coverage 

def detection(df): 
    if df.isnull().values.any(): 
      pathogens = []
      detected = "Negative"
      return pathogens, detected
    else: 
      pathogens = df.index[df['coverage'] > 50].to_list()
      if pathogens:
        detected = "Positive"
      else:
        detected = "Negative"
      return pathogens, detected

def d3_compatible_data(df, sample, hits, all, pathogens, detected):
    data = []
    rows, cols = df.index, df.columns
    for row in rows:
        values = float([df[c][row] for c in cols][0])
        data.append({cols[0]: values, 'pathogen': row})

    data_dict = {}
    data_dict['coverage'] = data
    data_dict['sample'] = sample
    data_dict['hits'] = hits
    data_dict['all'] = all
    data_dict['pathogens'] = pathogens
    data_dict['detected'] = detected
    return data_dict

@router.get('/results/{token}') 
async def analyze_quants(token: str):  
    results = {}
    query = await ModelSample.get_token(token)  
    sample_name = query['sample']

    headers=['Name', 'TPM'] 
    panel = query['panel']
    metadata = metadata_load(panel)
    sample_dir = os.path.join(RESULTS_FOLDER, token, sample_name) 
    quant_dir = os.path.join(sample_dir,'quant.sf')  

    hits_df = expression_hits_and_misses(quant_dir, headers, metadata, hits=True) 
    all_df = expression_hits_and_misses(quant_dir, headers, metadata, hits=False) 
    coverage = coverage_cal(hits_df,all_df)
    pathogens, detected = detection(coverage)
    return d3_compatible_data(coverage, sample_name, df_to_dict(hits_df), df_to_dict(all_df), pathogens, detected)