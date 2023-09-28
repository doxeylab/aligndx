from .base import r
import json, time


class Handler:
    QUEUE_KEY = "job_queue"

    @classmethod
    def enqueue_job(cls, id: str, data_json: str):
        r.set(id, data_json)  # Store the received JSON string directly

        score = time.time()  # Use the current timestamp as the score
        r.zadd(cls.QUEUE_KEY, {id: score})  # Add job to the sorted set with the given score

    @classmethod
    def dequeue_job(cls):
        jobs = r.zrange(cls.QUEUE_KEY, 0, 0, withscores=True)
        if not jobs:
            return None

        id, _ = jobs[0]
        r.zrem(cls.QUEUE_KEY, id)

        data_json = r.get(id)
        if data_json is None:
            return None

        data = json.loads(data_json) 
        return id, data

    @classmethod
    def get_job_position(cls, id: str) -> int:
        rank = r.zrank(cls.QUEUE_KEY, id)
        if rank is None:
            return -1  # Job is not in the queue
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
