import abc
from typing import Generic, TypeVar, Type
from uuid import uuid4, UUID

from sqlalchemy.ext.asyncio import AsyncSession
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
class BaseDal(Generic[IN_SCHEMA, SCHEMA, TABLE], metaclass=abc.ABCMeta):
    def __init__(self, db_session: AsyncSession, *args, **kwargs) -> None:
        self._db_session: AsyncSession = db_session

    @property
    @abc.abstractmethod
    def _table(self) -> Type[TABLE]:
        ...

    @property
    @abc.abstractmethod
    def _schema(self) -> Type[SCHEMA]:
        ...

    async def create(self, in_schema: IN_SCHEMA) -> SCHEMA:
        '''
        creates db entry and returns schema response model. Using the SQL ORM procedure, we place an object into the session and then flush and commit it to the db. Note that this is done async.

        The input schema/inschema acts as a validation paramter for db entries. 
        '''
        entry = self._table(id=uuid4(), **in_schema.dict())
        self._db_session.add(entry)
        await self._db_session.commit()
        return self._schema.from_orm(entry)

    async def get(self, val) -> SCHEMA:
        '''
        returns row matched to val
        '''
        entry = await self._db_session.get(self._table, val)
        if not entry:
            raise DoesNotExist(
                f"{self._table.__name__}<{val}> does not exist"
            )
        return self._schema.from_orm(entry)

    async def get_by_id(self, entry_id: UUID) -> SCHEMA:
        '''
        returns row by id 
        '''
        entry = await self._db_session.get(self._table, entry_id)
        if not entry:
            raise DoesNotExist(
                f"{self._table.__name__}<id:{entry_id}> does not exist"
            )
        return self._schema.from_orm(entry)
    