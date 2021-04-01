import os
from databases import Database
import sqlalchemy

'''
Database initialization file
'''

# defining database url
DATABASE_URL = os.getenv("DATABASE_URL")

# databases query builder 
database = Database(DATABASE_URL) 

# declaring metadata 
metadata = sqlalchemy.MetaData()


