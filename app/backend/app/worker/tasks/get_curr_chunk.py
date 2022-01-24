from app.worker import get_faust_app
from app.worker.tables.chunk_table import chunk_table
from app.worker.models.models import Account

faust_app = get_faust_app()

topic = faust_app.topic("get_current_count", value_type=Account)

@faust_app.agent(topic)
async def agent(stream):
    async for x in stream.group_by(Account.account_id):
        id = x.account_id
        if chunk_table[id]:
            chunk_number = chunk_table[id].chunk_number
            total_chunks = chunk_table[id].total_chunks

            print(f'Retrieving:\n Chunk {chunk_number} data of {total_chunks} for {id}\n')
            print(f'Data was of type {type(chunk_table[id].data)}')
            yield chunk_table[id]
        else:
            print(f'Table currently empty:\n {chunk_table[id]}')
            yield chunk_table[id]