from pydantic import BaseModel
from typing import Literal

class MetaModel(BaseModel):
    updir: str
    rdir: str
    tooldir: str
    fname: str
    total: int
    processed: int
    status: Literal['setup', 'uploading', 'analyzing', 'completed', 'error'] 
    data: str 
