import abc
from typing import Generic, TypeVar, Type
from uuid import uuid4, UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, delete
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

    async def create(self, entry):
        '''
        Creates new row entry in table. Autogenerates a new UUID, requires the rest of the table columns. Returns an id
        '''
        entry = self._table(id=uuid4(), **entry.dict())
        self._db_session.add(entry)
        await self._db_session.commit()
        return entry.id 

    async def update(self, entry_id: UUID, update_val):
        '''
        updates table row value val with update_val(s). Requires entry_id 
        '''
        statement = update(self._table).where(self._table.id==entry_id).values(**update_val.dict()).execution_options(synchronize_session="fetch")
        await self._db_session.execute(statement)
        await self._db_session.commit()

    async def delete_by_id(self, entry_id: UUID):
        '''
        deletes table row by id
        '''
        statement = delete(self._table).where(
            self._table.id==entry_id)
        await self._db_session.execute(statement)
        await self._db_session.commit()
    
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
    