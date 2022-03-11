import abc
from typing import Generic, TypeVar, Type
from uuid import uuid4, UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update
from app.models.schemas.base_schema import BaseSchema

# declare static type checkers for base data access layer
IN_SCHEMA = TypeVar("IN_SCHEMA", bound=BaseSchema)
SCHEMA = TypeVar("SCHEMA", bound=BaseSchema)
TABLE = TypeVar("TABLE")

class DoesNotExist(Exception):
    """ 
    Raised if the entity is not found in the database
    """
    ...  

# Abstract base class for generating data acccess layers
class BaseDal(Generic[TABLE], metaclass=abc.ABCMeta):
    def __init__(self, db_session: AsyncSession, *args, **kwargs) -> None:
        self._db_session: db_session

    @property
    @abc.abstractmethod
    def _table(self) -> Type[TABLE]:
        ... 

    async def create(self, schema):
        '''
        creates db entry and returns schema response model 
        '''
        entry = self._table(id=uuid4(), **schema)
        self._db_session.add(entry)
        await self._db_session.commit()
        return entry

    async def get(self, val):
        '''
        returns row by id 
        '''
        query = await self._db_session.get(self._table, val)
        if not query:
            raise DoesNotExist(
                f"{self._table.__name__}<id:{val}> does not exist"
            )
        return query

    async def update(self, val, update_val):
        '''
        updates table row value val with update_val(s)
        '''
        query = await self._db_session.execute(update(self._table)
                                              .where(val)
                                              .values(update_val))
        await self._db_session.commit()
        return query

    async def delete_by_id(self, entry_id: UUID):
        '''
        deletes row by id
        '''
        query = await self._db_session.delete(self._table, entry_id)
        await self._db_session.commit()
        return query
    
    async def get_by_id(self, entry_id: UUID):
        '''
        returns row by id 
        '''
        query = await self._db_session.get(self._table, entry_id)
        if not query:
            raise DoesNotExist(
                f"{self._table.__name__}<id:{entry_id}> does not exist"
            )
        return query
