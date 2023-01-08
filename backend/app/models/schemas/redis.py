from pydantic import BaseModel
from typing import Literal, Dict

class ItemModel(BaseModel):
    uploaded: bool
    analyzed: bool

class MetaModel(BaseModel):
    command: str
    updir: str
    rdir: str
    tmp: str
    items: Dict[str, ItemModel]
    status: Literal['setup', 'processing', 'completed', 'error'] 
    data: str

