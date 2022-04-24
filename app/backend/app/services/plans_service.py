# Schemas & DAL
from app.db.dals.payments import PlansDal

async def get_all_plans(db):
    plans_dal = PlansDal(db)
    plans = await plans_dal.get_all_available_plans()

    plans_list = []
    for plan in plans:
        plans_list.append(plan)

    return plans_list

async def get_plan_by_id(db, plan_id):
    plans_dal = PlansDal(db)
    return await plans_dal.get_by_id(plan_id)

async def get_eligible_plans(db, current_plan_name, tax_rate):
    '''
    returns eligible plans that a customer can upgrade/downgrade to.
    If customer is currently on "Basic Plan" with 13% Tax, they can upgrade to
        "Premium Plan" with 13% Tax only or any other 13% Tax rate Plan (if offered)
    '''
    plans_dal = PlansDal(db)
    plans = await plans_dal.get_eligible_plans_tax_rate(current_plan_name, tax_rate)
    
    plans_list = []
    for plan in plans:
        plans_list.append(plan)

    return plans_list
