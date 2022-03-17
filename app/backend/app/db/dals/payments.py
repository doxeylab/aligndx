from typing import Type

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
    
#  -- Invoices DAL -- 

class InvoicesDal(BaseDal[Invoices]):
    @property
    def _table(self) -> Type[Invoices]:
        return Invoices