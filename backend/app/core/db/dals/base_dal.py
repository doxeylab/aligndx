import abc
from typing import Generic, TypeVar, Type, Container, Optional
from uuid import uuid4, UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, delete

from pydantic import BaseConfig, BaseModel, create_model
from sqlalchemy.inspection import inspect
from sqlalchemy.orm.properties import ColumnProperty


class OrmConfig(BaseConfig):
    orm_mode = True


# declare static type checkers for base data access layer
TABLE = TypeVar("TABLE")


class DoesNotExist(Exception):
    """
    Raised if the entity is not found in the database
    """

    ...


# Abstract base class for generating data acccess layers
class BaseDal(Generic[TABLE], metaclass=abc.ABCMeta):
    def __init__(self, db_session: AsyncSession, *args, **kwargs) -> None:
        self._db_session: AsyncSession = db_session

    @property
    @abc.abstractmethod
    def _table(self) -> Type[TABLE]:
        ...

    async def create(self, entry):
        """
        Creates new row entry in table. Autogenerates a new UUID, requires the rest of the table columns. Returns an id
        """
        # remove id if none is supplied as parameter
        data = entry.dict()
        data.pop("id", None)
        entry = self._table(id=uuid4(), **data)
        self._db_session.add(entry)
        await self._db_session.commit()
        return entry.id

    async def update(self, entry_id: UUID, update_val):
        """
        updates table row value val with update_val(s). Requires entry_id
        """
        statement = (
            update(self._table)
            .where(self._table.id == entry_id)
            .values(**update_val.dict())
            .execution_options(synchronize_session="fetch")
        )
        await self._db_session.execute(statement)
        await self._db_session.commit()

    async def delete_by_id(self, entry_id: UUID):
        """
        deletes table row by id
        """
        statement = delete(self._table).where(self._table.id == entry_id)
        await self._db_session.execute(statement)
        await self._db_session.commit()

    async def get_by_id(self, entry_id: UUID):
        """
        returns row by id
        """
        query = await self._db_session.get(self._table, entry_id)
        if not query:
            raise DoesNotExist(f"{self._table.__name__}<id:{entry_id}> does not exist")
        return query

    def sqlalchemy_to_pydantic(
        db_model: Type, *, config: Type = OrmConfig, exclude: Container[str] = []
    ) -> Type[BaseModel]:
        mapper = inspect(db_model)
        fields = {}
        for attr in mapper.attrs:
            if isinstance(attr, ColumnProperty):
                if attr.columns:
                    name = attr.key
                    if name in exclude:
                        continue
                    column = attr.columns[0]
                    python_type: Optional[type] = None
                    if hasattr(column.type, "impl"):
                        if hasattr(column.type.impl, "python_type"):
                            python_type = column.type.impl.python_type
                    elif hasattr(column.type, "python_type"):
                        python_type = column.type.python_type
                    assert python_type, f"Could not infer python_type for {column}"
                    default = None
                    if column.default is None and not column.nullable:
                        default = ...
                    fields[name] = (python_type, default)
        pydantic_model = create_model(
            db_model.__name__, __config__=config, **fields  # type: ignore
        )
        return pydantic_model
