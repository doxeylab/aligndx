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
 
def coverage_calc(df):

  mask_cols = df.select_dtypes(include=['float64']).columns 
  hits = df.copy()

  mask = hits[mask_cols] > 0
  hits[mask_cols] = hits[mask_cols][mask]
  hits = hits.dropna()   

  all_count = df.groupby(["Pathogen"])['Name'].apply(np.count_nonzero)
  hits_count = hits.groupby(["Pathogen"])['Name'].apply(np.count_nonzero)
  coverage = np.round(hits_count/all_count * 100, decimals=2)
  coverage.fillna(0, inplace=True)

  return coverage.to_frame("Coverage")

def realtime_quant_analysis(sample_name, headers, metadata): 

  # Read in quant.sf file into pandas, grab chosen headers and drop na values
  df = pd.read_csv(sample_name, sep="\t") 
  df = df.loc[:, df.columns.isin(headers)]  
  df = df.dropna()   
 
  df_list = []
  for col in metadata:

    # match samples to metadata to subset pathogen hits
    sample = df.copy()
    sample['Name'] = sample[sample['Name'].isin(metadata[col])]
    sample = sample.dropna()       
    sample = sample.reset_index(drop=True)
    sample['Pathogen'] = col
    sample.set_index("Pathogen", inplace=True)  
     
    # generate copy of pathogen results so it doesn't write over previous df
    new_df = sample.copy()  
    df_list.append(new_df)

  matches_df = pd.concat(df_list)  
  # matches_df.reset_index(inplace=True) 
  return matches_df

def update_analysis(previous_chunk, current_chunk, header):
  df = previous_chunk.copy()
  summed_reads = current_chunk[header] + previous_chunk[header]
  df[header] = summed_reads
  return df

def detection(df):
  if df.isnull().values.any(): 
      pathogens = []
      detected = "Negative"
      return pathogens, detected
  else: 
    pathogens = df['Pathogen'][df['Coverage'] > 0].to_list()
    if pathogens:
      detected = "Positive"
    else:
      detected = "Negative"
    return pathogens, detected

def data_loader(output_dir): 
    df = pd.read_csv(output_dir, index_col='Pathogen')
    pathogens = df['Pathogen'].unique().tolist()
    df_list={} 
    for pathogen in pathogens:
      df_list[pathogen] = df.loc[df.Pathogen==pathogen][['Name', 'NumReads']].to_dict(orient="records")
    c = df.copy()
    c = c.groupby(["Pathogen","Coverage"]).count().drop(['Name','NumReads'], axis=1)  
    c = c.index.to_frame(index=False)
    pathogens, detected = detection(c)
    c = c.to_dict(orient="records")

    d3_data = {
        "all": df_list,
        "coverage": c,
        "pathogens": pathogens, 
        "detected": detected,
        'title': "Transcriptome Coverage Estimate",
        'xlabel': "Pathogens",
        'ylabel': "Coverage (%)"
    }   
    return d3_data