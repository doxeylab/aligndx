from typing import Type

from app.db.dals.base_dal import BaseDal
from app.db.tables.payments import Customers, Subscriptions, Invoices
from app.models.schemas.payments import InCustomerSchema, CustomerSchema, InSubscriptionSchema, SubscriptionSchema, InInvoiceSchema, InvoiceSchema

#  -- Customers DAL -- 

class CustomersDal(BaseDal[InCustomerSchema, CustomerSchema, Customers]):
    @property
    def _in_schema(self) -> Type[InCustomerSchema]:
        return InCustomerSchema

    @property
    def _schema(self) -> Type[CustomerSchema]:
        return CustomerSchema

    @property
    def _table(self) -> Type[Customers]:
        return Customers

#  -- Subscriptions DAL -- 

class SubscriptionsDal(BaseDal[InSubscriptionSchema, SubscriptionSchema, Subscriptions]):
    @property
    def _in_schema(self) -> Type[InSubscriptionSchema]:
        return InSubscriptionSchema
    
    @property
    def _schema(self) -> Type[SubscriptionSchema]:
        return CustomerSchema
    
    @property
    def _table(self) -> Type[Subscriptions]:
        return Subscriptions

#  -- Invoices DAL -- 

class InvoicesDal(BaseDal[InInvoiceSchema, InvoiceSchema, Invoices]):
    @property
    def _in_schema(self) -> Type[InInvoiceSchema]:
        return InInvoiceSchema

    @property
    def _schema(self) -> Type[InvoiceSchema]:
        return InvoiceSchema
    
    @property
    def _table(self) -> Type[Invoices]:
        return Invoices