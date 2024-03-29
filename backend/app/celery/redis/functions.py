from .base import r
import json, time
from typing import Optional
import logging

class Handler:
    QUEUE_KEY = "job_queue"
    COUNTER_KEY = "job_position_increment"

    @classmethod
    def enqueue_job(cls, id: str):
        score = time.time()  
        r.zadd(cls.QUEUE_KEY, {id: score})  

    @classmethod
    def dequeue_job(cls, id : str):
        if not r.zscore(cls.QUEUE_KEY, id): 
            return None

        r.zrem(cls.QUEUE_KEY, id)

        data_json = r.get(id)
        if data_json is None:
            return None

        try:
            data = json.loads(data_json)
        except json.JSONDecodeError:
            return None
        
        r.delete(id)
        
        return id, data

    @classmethod
    def get_job_position(cls, id: str) -> Optional[int]:
        rank = r.zrank(cls.QUEUE_KEY, id)
        if rank is None:
            return None  # Job is not in the queue
        return rank + 1

    @classmethod
    def create(cls, key: str, data_json: str):
        r.set(key, data_json)

    @classmethod
    def retrieve(cls, key: str) -> dict:
        data_json = r.get(key)
        return json.loads(data_json) if data_json else None 

    @classmethod
    def delete(cls, key: str):
        r.delete(key)