import faust

class Chunk(faust.Record):
    account_id: str
    coverage: dict
    pathogens: list
    detected: bool
    sample: str  

class Account(faust.Record):
    account_id: str