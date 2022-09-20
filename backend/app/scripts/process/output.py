import pandas as pd

class Output():
    def __init__(self, data_dir, data_loader) -> None:
        self.data_dir = data_dir
        self.data_loader = data_loader

    def _retrieve(self):
        try:
            stored_data = pd.read_json(self.data_dir, orient="table")
        except:
            stored_data = None

        return stored_data

    def load(self):
        '''
        Loads data 
        '''
        stored_data = self._retrieve()
        if stored_data is not None:
            data = self.data_loader(stored_data)
            return data
        else:
            return None
    
