import pandas as pd
import numpy as np

class Analyze():
    def __init__(self, panel, out_dir, data_dir, transform, sum_header) -> None: 
        self.panel = panel
        self.out_dir = out_dir
        self.data_dir = data_dir
        self.transform = transform
        self.sum_header = sum_header

    def _write(self, data, data_fname):
        '''
        writes datataframe to json
        '''
        with open(data_fname, 'w') as f:
            data.to_json(f, orient="table", indent=4)

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
    
    def _combine(self, prev, curr, sum_header,):
        '''
        sums two dataframes
        '''
        df = curr.copy()
        summed = curr[sum_header] + prev[sum_header]
        df[sum_header] = summed

        return df

    def accumulate(self) -> None:
        '''
        Accumulates chunked quant files, and writes it to /path/data.json
        '''
        prev_chunk = self._retrieve(self.data_dir)
      
        if prev_chunk is None:
            # first chunk!
            chunk = self.transform()
            self._write(chunk, self.data_dir)
            
        else:
            # current_ quant_data
            current_chunk = self.transform()

            # sum results
            accumulated_results = self._combine(prev_chunk, current_chunk, self.sum_header)
            
            self._write(accumulated_results, self.data_dir)

    def status(self):
        '''
        Returns current data that is stored
        '''
        stored_data = self._retrieve(self.data_dir)
        return stored_data