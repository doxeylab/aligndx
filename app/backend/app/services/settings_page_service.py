from app.services import subscription_service, customer_service, plans_service, invoice_service
from app.models.schemas.payments.settings_page import AdminSettingsPageResponse, NonAdminSettingsPageResponse
from app.db.dals.users import UsersDal
from app.auth.models import UserDTO
from fastapi import status, HTTPException

async def get_admin_settings(db, current_user: UserDTO):
    '''
    returns entities needed for front-end settings page where user logged in as 'Admin'.
    '''

    if current_user.customer_id == None:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "A customer entity doesn't exist.")

    sub = await subscription_service.get_recent(db, current_user.customer_id)

    customer = await customer_service.get_by_id(db, current_user.customer_id)

    current_plan = await plans_service.get_plan_by_id(db, sub.plan_id)

    if sub.scheduled_plan_id:
        scheduled_plan = await plans_service.get_plan_by_id(db, sub.scheduled_plan_id)
    
    plans = await plans_service.get_eligible_plans(db, current_plan.name, current_plan.tax_rate)

    invoices = await invoice_service.get_all_invoices(db, current_user.customer_id)

    users = await get_all_users(db, current_user.customer_id)

    response_model = AdminSettingsPageResponse(
        customer = customer,
        subscription = sub,
        current_plan = current_plan,
        scheduled_plan = scheduled_plan,
        available_plans = plans,
        invoices = invoices,
        users = users
    )
    return response_model

async def get_non_admin_settings(db, current_user: UserDTO):
    '''
    returns entities needed for front-end settings page where user logged in is 'Not Admin'.
    '''

    if current_user.customer_id == None:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "A customer entity doesn't exist.")
    
    sub = await subscription_service.get_recent(db, current_user.customer_id)

    customer = await customer_service.get_by_id(db, current_user.customer_id)

    current_plan = await plans_service.get_plan_by_id(db, sub.plan_id)

    response_model = NonAdminSettingsPageResponse(
        subscription = sub,
        current_plan = current_plan,
        customer = customer
    )
    return response_model

async def get_all_users(db, customer_id):
    users_dal = UsersDal(db)
    users = await users_dal.get_all_users_for_customer(customer_id)
    users_list = []
    for user in users:
        users_list.append(user)

    return users_list
