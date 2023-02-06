from pydantic import BaseModel, Field
from typing import List
from .inputs import InputSchema

class Schema(BaseModel):
    id : str = Field(description='A unique identifier for the pipeline')
    title : str = Field(description='Title for pipeline')
    description: str = Field(description='Description for the pipeline')
    categories : list = Field(description='List of categories the pipeline may classified under')
    inputs: List[InputSchema]
    pipeline_type: str = Field(description='The type of pipeline')
    repository: str = Field(description='Repository for this pipeline')
    report_inputs: List[str] = Field(description='Files for report generation')
 
class Response(BaseModel):
    id : str = Field(description='A unique identifier for the pipeline')
    title : str = Field(description='Title for pipeline')
    description: str = Field(description='Description for the pipeline')
    categories : list = Field(description='List of categories the pipeline may classified under')
    inputs: List[InputSchema]