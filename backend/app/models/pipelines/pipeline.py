from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from .inputs import InputSchema

class Schema(BaseModel):
    id : str = Field(description='A unique identifier for the pipeline')
    title : str = Field(description='Title for pipeline')
    description: str = Field(description='Description for the pipeline')
    image: str = Field(description='Image used to run pipeline')
    launch: str = Field(description='Pipeline launch command')
    inputs: List[InputSchema]
    report_inputs: Optional[Dict[str,str]] = Field(description='Keyword arguments for report construction')
 
class Response(BaseModel):
    id : str = Field(description='A unique identifier for the pipeline')
    title : str = Field(description='Title for pipeline')
    description: str = Field(description='Description for the pipeline')
    categories : list = Field(description='List of categories the pipeline may classified under')
    inputs: List[InputSchema]
