from pydantic import BaseModel, Field
from typing import List, Union, Literal, Dict, Optional
from typing_extensions import Annotated

class Base(BaseModel):
    id : str = Field(description='A unique command identifier')
    values: List[str] = Field(None, description='Input value(s)')
    status: Literal['ready', 'pending'] = Field(None)
    title: str = Field(description='Title for input')
    description: str = Field(description='Description for input field')
    count: Literal['single', 'multiple']
    optional: bool = Field(default=False,description='Boolean flag to describe input as optional or not')

class FileMeta(BaseModel):
    size: Optional[int] = Field(None, description='Size of file in bytes')
    name: str = Field('')
    offset: int = Field(0,description='Current offset')
    status: Literal['requested','created', 'uploading', 'finished', 'paused', 'terminated']
    
class File(Base):
    input_type : Literal['file']
    file_types: List[str] = Field(description='Allowed file_types for input')
    file_meta: Dict[str, FileMeta] = Field({}, description='File metadata')
    values: List[str] = Field(None, description='Input value(s)')

class Select(Base):
    input_type : Literal['select']
    options: List[str] = Field(description='List of options for this input')
    metadata: str = Field(description='CSV providing metadata on the options')

class Text(Base):
    input_type : Literal['text']

class PreDefined(Base):
    input_type : Literal['predefined']
 
InputSchema = Annotated[Union[File, Select, Text, PreDefined], Field(..., discriminator='input_type',description='A dynamic schema consisting of the inputs users can submit for the pipeline')]
