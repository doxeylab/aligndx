from random import sample
import pandas as pd

class StoredQuantData():
    def __init__(self, data_dir) -> None:
        self.data_dir = data_dir

    def _retrieve(self):
        try:
            stored_data = pd.read_json(self.data_dir, orient="table")
        except:
            stored_data = None

        return stored_data

    def _data_loader(self, df, sample_name, status):
        headers=['Gene', 'TPM']
        c = df.copy()
        c = c.groupby(["Pathogen","Coverage"]).count().drop(headers, axis=1)  
        c = c.index.to_frame(index=False)
        c = c.to_dict(orient="records")

        data = {
          "coverage": c,
          "sample": sample_name,
          "title": "Transcriptome Coverage Estimate",
          "xlabel": "Pathogens",
          "ylabel": "Coverage (%)",
          "status": status
        }

        return data 

    def load(self, sample_name, status):
        '''
        Loads data 
        '''
        stored_data = self._retrieve()
        if stored_data is not None:
            data = self._data_loader(stored_data, sample_name, status)
            return data
        else:
            return None
    
