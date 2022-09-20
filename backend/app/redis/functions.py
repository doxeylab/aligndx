from app.redis.base import r  
import json

class Handler:
        # create key,data entry
        def create(id: str, data: dict):
                data_json = json.dumps(data)
                r.set(id, data_json)
        
        # get data
        def retrieve(id: str):
                data = r.get(id)
                return json.loads(data)

        # delete key
        def delete(id: str):
                r.delete(id)