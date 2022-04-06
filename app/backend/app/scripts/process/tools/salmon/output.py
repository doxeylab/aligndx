import pandas as pd

class Output():
    def __init__(self, data_dir) -> None:
        self.data_dir = data_dir

    def _retrieve(self):
        try:
            stored_data = pd.read_json(self.data_dir, orient="table")
        except:
            stored_data = None

        return stored_data

    def _data_loader(self, df):
        headers=['Gene', 'TPM']
        c = df.copy()
        c = c.groupby(["Pathogen","Coverage"]).count().drop(headers, axis=1)  
        c = c.index.to_frame(index=False)
        c = c.to_dict(orient="records")

        data = {
          "coverage": c,
          "title": "Transcriptome Coverage Estimate",
          "xlabel": "Pathogens",
          "ylabel": "Coverage (%)",
        }

        return data 

    def load(self):
        '''
        Loads data 
        '''
        stored_data = self._retrieve()
        if stored_data is not None:
            data = self._data_loader(stored_data)
            return data
        else:
            return None
    
