import pandas as pd
import os
from app.config.settings import get_settings

settings = get_settings()

class MetaModel:
    _meta_dir = settings.FolderSettings.METADATA_FOLDER

    def __init__(self, panel):
        self.panel = panel
    
    def _grab_id(self, id, prefix, strip): 
      if type(id) == str:
        x = id.split(" ")   
        for names in x: 
          if names.startswith(prefix):
            return (names.strip(strip))

    def load(self):
        metadata_path = os.path.join(self._meta_dir, self.panel + "_metadata.csv")
        metadata = pd.read_csv(metadata_path, sep=";")

        metadata = metadata.applymap(lambda x: self._grab_id(id=x,prefix=">lcl|", strip=">")) 
        metadata = metadata[~metadata.isnull()]  
        metadata = metadata.apply(lambda x: pd.Series(x.dropna().values))
        metadata = metadata.fillna('')   
        
        return metadata


