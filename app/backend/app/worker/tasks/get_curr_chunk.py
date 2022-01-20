from app.worker import get_faust_app
from app.worker.tables.chunk_table import chunk_table
from app.worker.models.models import Account

faust_app = get_faust_app()

topic = faust_app.topic("get_current_count", value_type=Account)


@faust_app.agent(topic)
async def agent(stream):
    async for x in stream.group_by(Account.account_id):
        yield chunk_table[x.account_id]
