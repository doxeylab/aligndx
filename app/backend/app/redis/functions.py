from app.redis.base import r  

class Handler:
        # task 1 -> create metadata
        def create(id: str, metadata: dict):
                r.set(id, metadata)
        
        # task 2 -> get metadata
        def retrieve(id: str):
                r.get(id)