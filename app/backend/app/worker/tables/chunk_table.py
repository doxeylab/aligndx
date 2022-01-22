from app.worker import get_faust_app

faust_app = get_faust_app()

chunk_table = faust_app.GlobalTable(
    "chunks",
    default=dict
)
  