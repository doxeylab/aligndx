import pandas as pd
import numpy as np
from app.scripts.post_processing.Meta import MetaModel

class AnalyzeQuant():
    def __init__(self, panel, quant, headers, data_fname) -> None:
        self.panel = panel
        self.quant = quant
        self.headers = headers
        self.data_fname = data_fname
        self.metadata = MetaModel(self.panel).load()
    
    def _coverage(self, df, header):
        '''
        Calculates coverage for given df
        '''
        hits = df.copy()
        
        hits = hits[hits[header] > 0] 

        all_count = df.groupby(['Pathogen'])['Gene'].apply(np.count_nonzero)
        hits_count = hits.groupby(['Pathogen'])['Gene'].apply(np.count_nonzero)
        coverage = np.round(hits_count.astype(np.double)/all_count.astype(np.double) * 100, decimals=2)
        coverage.fillna(0, inplace=True)
        
        return coverage.to_frame("Coverage")

    def _parse(self):
        '''
        Reads in quant file and returns the resulting matches sorted by the loaded metadata panel 
        '''
         # Read in quant.sf file into pandas, grab chosen headers and drop na values
        df = pd.read_csv(self.quant, sep="\t") 
        df = df.loc[:, df.columns.isin(self.headers)]  
        df = df.dropna()   

        df_list = []
        for col in self.metadata:

          # match samples to metadata to subset pathogen hits
          sample = df.copy()

          sample = sample[sample['Name'].isin(self.metadata[col])]
          sample = sample.dropna()       
          sample = sample.reset_index(drop=True)
          sample['Pathogen'] = col

          sample.rename(columns={"Name":"Gene"}, inplace=True)

          # sample.set_index("Pathogen", inplace=True)  

          # generate copy of pathogen results so it doesn't write over previous df
          new_df = sample.copy()  
          df_list.append(new_df)

        matches_df = pd.concat(df_list)  

        matches_df.set_index("Pathogen", inplace=True)
        matches_df['Coverage'] = self._coverage(matches_df, self.headers[1])
        matches_df.reset_index(inplace=True)

        return matches_df
    
    def _write(self, data, data_fname):
        '''
        writes datataframe to json
        '''
        with open(data_fname, 'w') as f:
            data.to_json(f, orient="table")

    def _retrieve(self, data_fname):
        '''
        retrieves previous dataframe, if it exists
        '''
        try:
          with open(data_fname) as f:
              data = pd.read_json(f, orient="table")
          return data
        except:
          return None
    
    def _update(self, prev, curr, header):
        '''
        sums two dataframes
        '''
        df = curr.copy()
        summed = curr[header] + prev[header]
        df[header] = summed

        return df

    def accumulate(self) -> None:
        '''
        Accumulates chunked quant files, and writes it to /path/data.json
        '''
        prev_chunk = self._retrieve(self.data_fname)
      
        if prev_chunk is None:
            # first chunk!
            chunk = self._parse()
            self._write(chunk, self.data_fname)
            
        else:
            # current_ quant_data
            current_chunk = self._parse()

            # sum results
            accumulated_results = self._update(prev_chunk, current_chunk, self.headers[1])
            accumulated_results.set_index("Pathogen", inplace=True)
            accumulated_results['Coverage'] = self._coverage(accumulated_results, self.headers[1])
            accumulated_results.reset_index(inplace=True)
            
            self._write(accumulated_results, self.data_fname)

    def status(self):
        '''
        Returns current data that is stored
        '''
        stored_data = self._retrieve(self.data_fname)
        return stored_data