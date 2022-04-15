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