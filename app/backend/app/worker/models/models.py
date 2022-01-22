import faust

class Chunk(faust.Record):
    account_id: str
    chunk_number: int
    total_chunks: int
    data: bytes  

class Account(faust.Record):
    account_id: str