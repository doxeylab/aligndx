# Schemas & DAL
from app.models.schemas.payments.invoices import CreateNewInvoice
from app.core.db.dals.payments import InvoicesDal

# Utils
from datetime import datetime

async def create_invoice(db, stripe_invoice, sub_id, customer_id):
    """
    Creates a new invoice in invoices table.

    :param stripe_invoice: Stripe's invoice object
    :param sub_id: id of the subscription the invoice belongs to
    :param customer_id: id of the customer the invoice belongs to

    Stripe Docs: https://stripe.com/docs/api/invoices/object
    """
    new_invoice = CreateNewInvoice(
        status = "paid",
        amount_due = stripe_invoice["amount_due"],
        amount_paid = stripe_invoice["amount_paid"],
        currency = stripe_invoice["currency"],
        invoice_date = datetime.fromtimestamp(stripe_invoice["created"]),
        billing_period_start = datetime.fromtimestamp(stripe_invoice["period_start"]),
        billing_period_end = datetime.fromtimestamp(stripe_invoice["period_end"]),
        stripe_invoice_id = stripe_invoice["id"],
        stripe_payment_intent_id = stripe_invoice["payment_intent"]["id"],
        stripe_invoice_url = stripe_invoice["hosted_invoice_url"],
        stripe_invoice_number = stripe_invoice["number"],
        subscription_id = sub_id,
        customer_id = customer_id,
        creation_time = datetime.now(),
        payment_card_type = stripe_invoice["payment_intent"]["payment_method"]["card"]["brand"],
        payment_card_last4 = stripe_invoice["payment_intent"]["payment_method"]["card"]["last4"],
        payment_card_expiry = f'{stripe_invoice["payment_intent"]["payment_method"]["card"]["exp_month"]}/{stripe_invoice["payment_intent"]["payment_method"]["card"]["exp_year"]}',
        stripe_payment_method_id = stripe_invoice["payment_intent"]["payment_method"]["id"],
        stripe_payment_receipt_url = stripe_invoice["payment_intent"]["charges"]["data"][0]["receipt_url"],
    )

    invoice_dal = InvoicesDal(db)
    invoice_id = await invoice_dal.create(new_invoice)
    return invoice_id

async def get_all_invoices(db, customer_id):
    """
    Returns all the invoices for a particular customer.

    :param customer_id: id of the customer the invoices belongs to
    """
    invoice_dal = InvoicesDal(db)
    invoices = await invoice_dal.get_by_customer_id(customer_id)

    invoices_list = []
    for invoice in invoices:
        invoices_list.append(invoice)

    return invoices_list
