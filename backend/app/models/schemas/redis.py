from pydantic import BaseModel
from typing import Literal, Dict 

class ItemModel(BaseModel):
    uploaded: bool
    analyzed: bool

class MetaModel(BaseModel):
    container_id: str
    dirs: Dict[str, str]
    items: Dict[str, ItemModel]
    endpoints: Dict[str, str]
    status: Literal['setup', 'uploading', 'analyzing', 'processing', 'completed', 'error']
    processes: Dict[str,str] 


