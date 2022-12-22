from pydantic import BaseModel
from typing import Literal, List, Dict

class ItemModel(BaseModel):
    uploaded: bool
    analyzed: bool

class MetaModel(BaseModel):
    updir: str
    rdir: str
    items: Dict[str, ItemModel]
    status: Literal['setup', 'processing', 'completed', 'error'] 
    data: str

