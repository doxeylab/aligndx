from typing import Type
from sqlalchemy import select
from app.db.dals.base_dal import BaseDal
from app.db.tables.payments import Customers, Subscriptions, Invoices

#  -- Customers DAL -- 

class CustomersDal(BaseDal[Customers]): 
    @property
    def _table(self) -> Type[Customers]:
        return Customers

#  -- Subscriptions DAL -- 

class SubscriptionsDal(BaseDal[Subscriptions]):
    @property
    def _table(self) -> Type[Subscriptions]:
        return Subscriptions
    
    async def get_subscription_by_stripe_id(self, stripe_id):
        stmt =  select(self._table).where(self._table.stripe_subscription_id == stripe_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
#  -- Invoices DAL -- 

class InvoicesDal(BaseDal[Invoices]):
    @property
    def _table(self) -> Type[Invoices]:
        return Invoices