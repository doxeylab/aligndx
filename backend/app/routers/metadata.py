import os   

from fastapi import APIRouter 

from app.config.settings import settings

import pandas as pd 

router = APIRouter()

PANELS = settings.PANELS
panel_metadata = pd.read_csv(PANELS)

@router.get("/panels")
async def retrieve_panels():
    panels = panel_metadata.loc[:, 'CDC' : 'CNS'].columns.to_list()
    return panels

@router.get("/panels_description")
async def panel_descr():
    panels = panel_metadata.loc[:, 'CDC' : 'CNS'].columns.to_list()

    panel_descr = {}
    for panel in panels: 
        panel_descr[panel] = {
            'organisms' : panel_metadata[panel_metadata[panel] == 'Y']['Name'].to_list()
        }

    return panel_descr

@router.post("/panel_orgs")
async def get_panel_orgs(panel : str):
    panels = panel_metadata.loc[:, 'CDC' : 'CNS'].columns.to_list()

    if panel in panels:
        return panel_metadata[panel_metadata[panel] == 'Y']['Name'].to_list()
    
    else:
        return 'Panel Does not exist'