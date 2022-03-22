import pandas as pd
import os


class MetaModel:
    def __init__(self, panel):
        self.panel = panel
    
    def _grab_id(id, prefix, strip): 
      if type(id) == str:
        x = id.split(" ")   
        for names in x: 
          if names.startswith(prefix):
            return (names.strip(strip))

    def load(self):
        metadata_path = os.path.join(dir, self.panel + "_metadata.csv")
        metadata = pd.read_csv(metadata_path, sep=";")

        metadata = metadata.applymap(lambda x: self._grab_id(x,prefix=">lcl|", strip=">")) 
        metadata = metadata[~metadata.isnull()]  
        metadata = metadata.apply(lambda x: pd.Series(x.dropna().values))
        metadata = metadata.fillna('')   
        
        return metadata


