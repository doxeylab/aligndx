from typing import Type
from sqlalchemy import select
from .base_dal import BaseDal
from ..tables.payments import Customers, Subscriptions, Invoices, Plans

#  -- Customers DAL -- 

class CustomersDal(BaseDal[Customers]): 
    @property
    def _table(self) -> Type[Customers]:
        return Customers
    
    async def get_customer_by_stripe_id(self, stripe_customer_id):
        '''
        Returns a customer which matches the stripe customer id.
        '''
        stmt =  select(self._table).where(self._table.stripe_customer_id == stripe_customer_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()

#  -- Subscriptions DAL -- 

class SubscriptionsDal(BaseDal[Subscriptions]):
    @property
    def _table(self) -> Type[Subscriptions]:
        return Subscriptions
    
    async def get_subscription_by_stripe_id(self, stripe_id):
        '''
        Returns a subscription which matches the stripe_subscription_id.
        '''
        stmt =  select(self._table).where(self._table.stripe_subscription_id == stripe_id)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
    async def get_recently_cancelled_subscription(self, customer_id):
        '''
        Returns the most recently cancelled subscription, if any.
        '''
        stmt =  select(self._table)\
            .where(self._table.customer_id == customer_id,
                    self._table.is_cancelled == True,
                    self._table.status != 'incomplete')\
            .order_by(self._table.creation_time.desc())
        query = await self._db_session.execute(stmt)
        return query.scalars().first()
    
    async def get_active_subscription_by_customer_id(self, customer_id):
        '''
        Returns an active subscription matching the customer requested, if any.
        '''
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
    
    async def get_by_customer_id(self, customer_id):
        '''
        Returns all invoices for a given customer id.
        '''
        stmt =  select(self._table)\
            .where(self._table.customer_id == customer_id)
        query = await self._db_session.execute(stmt)
        return query.scalars()

#  -- Plans DAL -- 
class PlansDal(BaseDal[Invoices]):
    @property
    def _table(self) -> Type[Plans]:
        return Plans
    
    async def get_available_plan_by_id(self, plan_id):
        '''
        Returns one plan which is not archived.
        '''
        stmt =  select(self._table)\
            .where(self._table.id == plan_id,
                self._table.is_archived == False)
        query = await self._db_session.execute(stmt)
        return query.scalars().first()

    async def get_all_available_plans(self):
        '''
        Returns all available plans (not archived).
        '''
        stmt =  select(self._table)\
            .where(self._table.is_archived == False)
        query = await self._db_session.execute(stmt)
        return query.scalars()
    
    async def get_eligible_plans_tax_rate(self, current_plan_name, tax_rate):
        '''
        Returns plans for a specific tax rate except the curent plan name
        '''
        stmt =  select(self._table)\
            .where(self._table.is_archived == False,
                    self._table.name != current_plan_name,
                    self._table.tax_rate == tax_rate)
        query = await self._db_session.execute(stmt)
        return query.scalars()