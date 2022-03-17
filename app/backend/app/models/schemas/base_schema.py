from pydantic import BaseModel

# defining the shape of valid data
class BaseSchema(BaseModel):
    class Config(BaseModel.Config):
        orm_mode = True