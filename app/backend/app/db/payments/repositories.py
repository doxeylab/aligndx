from app.db.database import database
from app.db.payments.models import customers, subscriptions, invoices
from app.db.payments.schemas import CustomerDTO

class CustomerRepo:
    @classmethod
    async def create_customer(cls, **customer):
        query = customers.insert().values(**customer)
        customer_id = await database.execute(query)
        return customer_id

    @classmethod
    async def get_customer_by_id(cls, id):
        query = customers.select().where(customers.c.id == id)
        customer = await database.fetch_one(query)
        return CustomerDTO(**customer)

    @classmethod
    async def update_customer(cls, id, stripe_id):
        query = customers.update().where(customers.c.id == id).values(
            stripe_customer_id = stripe_id
        )
        await database.execute(query)

class SubscriptionRepo:
    @classmethod
    async def create_subscription(cls, **subscription):
        query = subscriptions.insert().values(**subscription)
        subscription_id = await database.execute(query)
        return subscription_id
    
    @classmethod
    async def update_subscription(cls, id, **update_items):
        query = subscriptions.update().where(subscriptions.c.id == id).values(**update_items)
        await database.execute(query)

class InvoiceRepo:
    @classmethod
    async def create_invoice(cls, **invoice):
        query = invoices.insert().values(**invoice)
        invoice_id = await database.execute(query)
        return invoice_id