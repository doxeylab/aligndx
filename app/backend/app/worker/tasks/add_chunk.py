from app.worker import get_faust_app
from app.worker.tables.chunk_table import chunk_table
from app.worker.models.models import Chunk

faust_app = get_faust_app()

topic = faust_app.topic("increment", value_type=Chunk)


@faust_app.agent(topic)
async def agent(chunks):
    async for chunk in chunks.group_by(Chunk.account_id):
        id = chunk.account_id
        chunk_table[id] = chunk
        chunk_number = chunk_table[id].chunk_number
        total_chunks = chunk_table[id].total_chunks
        print(f'Adding:\n Chunk {chunk_number} data of {total_chunks} for {id}\n')
        print(f'Data sent as type {type(chunk.data)}')
        print(f'Data stored as type {type(chunk_table[id].data)}')

        yield chunk_table[id]