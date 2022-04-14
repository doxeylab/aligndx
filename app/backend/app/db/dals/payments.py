from typing import Type
from sqlalchemy import select
from app.db.dals.base_dal import BaseDal
from app.db.tables.payments import Customers, Subscriptions, Invoices, Plans

#  -- Customers DAL -- 

class CustomersDal(BaseDal[Customers]): 
    @property
    def _table(self) -> Type[Customers]:
        return Customers
    
    async def get_customer_by_stripe_id(self, stripe_customer_id):
        stmt =  select(self._table).where(self._table.stripe_customer_id == stripe_customer_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()

#  -- Subscriptions DAL -- 

class SubscriptionsDal(BaseDal[Subscriptions]):
    @property
    def _table(self) -> Type[Subscriptions]:
        return Subscriptions
    
    async def get_subscription_by_stripe_id(self, stripe_id):
        stmt =  select(self._table).where(self._table.stripe_subscription_id == stripe_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
    async def get_subscription_by_customer_id(self, customer_id):
        stmt =  select(self._table).where(self._table.customer_id == customer_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
    async def get_active_subscription_by_customer_id(self, customer_id):
        stmt =  select(self._table)\
            .where(self._table.customer_id == customer_id,
                   self._table.is_active == True)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
#  -- Invoices DAL -- 
class InvoicesDal(BaseDal[Invoices]):
    @property
    def _table(self) -> Type[Invoices]:
        return Invoices

#  -- Plans DAL -- 
class PlansDal(BaseDal[Invoices]):
    @property
    def _table(self) -> Type[Plans]:
        return Plans
    
    async def get_available_plan_by_id(self, plan_id):
        stmt =  select(self._table)\
            .where(self._table.id == plan_id,
                self._table.is_archived == False)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()

    async def get_all_available_plans(self):
        stmt =  select(self._table)\
            .where(self._table.is_archived == False)
        query = await self._db_session.execute(stmt)
        return query.scalars()