import os   

from fastapi import APIRouter 

from app.config.settings import settings

router = APIRouter()

INDEX_FOLDER = settings.INDEX_FOLDER
METADATA_FOLDER = settings.METADATA_FOLDER  

@router.get("/panels")
async def retrieve_panels():
    panels_list = os.listdir(METADATA_FOLDER)
    
    for i, _ in enumerate(panels_list):
      panels_list[i] = panels_list[i].replace("_metadata.csv", "")
    
    panel_opts = {'id': "panel",
        "category": "Panel",
        "opts":[]
        }
    
    selectmenuopts = []
    for panel in panels_list:
        panel_opts["opts"].append(
              {"value": panel, "label": panel.capitalize()}
            )
        selectmenuopts.append(
            panel_opts
        )
    print(selectmenuopts)
    
    return selectmenuopts