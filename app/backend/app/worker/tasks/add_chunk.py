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
        yield chunk_table[id]