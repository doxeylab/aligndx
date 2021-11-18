import pandas as pd
import os
import numpy as np

def grab_id(id, prefix, strip): 
  if type(id) == str:
    x = id.split(" ")   
    for names in x: 
      if names.startswith(prefix):
        return (names.strip(strip)) 

def metadata_load(dir, panel): 
  metadata_path = os.path.join(dir, panel + "_metadata.csv")
  metadata = pd.read_csv(metadata_path, sep=";")
  metadata = metadata.applymap(lambda x: grab_id(x,prefix=">lcl|", strip=">")) 
  metadata = metadata[~metadata.isnull()]  
  metadata = metadata.apply(lambda x: pd.Series(x.dropna().values))
  metadata = metadata.fillna('')   
  return metadata
 

def expression_hits_and_misses(sample_name, headers, metadata, hits): 
  df = pd.read_csv(sample_name, sep="\t") 
  df = df.loc[:, df.columns.isin(headers)]  
  df = df.dropna()   
  
  df_list = []
  for col in metadata:
    sample = df.copy()
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
