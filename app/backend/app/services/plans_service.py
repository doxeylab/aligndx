# Schemas & DAL
from app.db.dals.payments import PlansDal

async def get_all_plans(db):
    plans_dal = PlansDal(db)
    plans = await plans_dal.get_all_available_plans()

    plans_list = []
    for plan in plans:
        plans_list.append(plan)

    return plans_list