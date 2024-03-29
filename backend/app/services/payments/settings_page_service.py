from app.services.payments import subscription_service, plans_service, invoice_service, customer_service
from app.models.payments.settings_page import AdminSettingsPageResponse, NonAdminSettingsPageResponse
from app.models.auth import UserDTO
from app.core.db.dals.users import UsersDal
from fastapi import status, HTTPException

async def get_admin_settings(db, current_user: UserDTO):
    '''
    returns entities needed for front-end settings page where user logged in as 'Admin'.
    '''

    if current_user.customer_id == None:
        raise HTTPException(status_code = status.HTTP_400_BAD_REQUEST,
                        detail = "A customer entity doesn't exist.")

    users = await get_all_users(db, current_user.customer_id)
    customer = await customer_service.get_by_id(db, current_user.customer_id)

    sub = await subscription_service.get_recent(db, current_user.customer_id)
    if sub == None:
        return AdminSettingsPageResponse(
                current_user = current_user,
                customer = customer,
                users = users
            )
    current_plan = await plans_service.get_plan_by_id(db, sub.plan_id)
    invoices = await invoice_service.get_all_invoices(db, current_user.customer_id)

    if sub.is_active == False:
        return AdminSettingsPageResponse(
            current_user = current_user,
            customer = customer,
            subscription = sub,
            current_plan = current_plan,
            invoices = invoices,
            users = users
        )

    # return the following if there is an active subscription

    scheduled_plan = None
    if sub.scheduled_plan_id:
        scheduled_plan = await plans_service.get_plan_by_id(db, sub.scheduled_plan_id)
    
    plans = await plans_service.get_eligible_plans(db, current_plan.name, current_plan.tax_rate)

    response_model = AdminSettingsPageResponse(
        current_user = current_user,
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
        return NonAdminSettingsPageResponse(current_user = current_user)
    
    sub = await subscription_service.get_recent(db, current_user.customer_id)
    if sub == None:
        return NonAdminSettingsPageResponse(current_user = current_user)
    
    customer = await customer_service.get_by_id(db, current_user.customer_id)

    response_model = NonAdminSettingsPageResponse(
        current_user = current_user,
        subscription = sub,
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
