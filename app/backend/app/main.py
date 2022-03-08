# python
import os, asyncio 

# fastapi
from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

# auth
from app.auth.auth_dependencies import get_current_user 

# routers
from app.api_v1.routers import uploads, results, users, socket_resources, metadata
from app.api_v1.routers.payments import payments

# db
from app.db.database import database

# streaming worker
# import app.worker as worker

# settings
from app.config.settings import get_settings

 

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0", 
)
 

lst_origins = os.getenv("ORIGINS")
origins = lst_origins.replace(" ", "").split(",")  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)

app.include_router(
    uploads.router,
    prefix="/uploads",
    tags=["Uploads"],
    dependencies=[Depends(get_current_user)],
    responses={418: {"description": "I'm a teapot"}},
)

app.include_router(
    results.router,
    prefix="/results",
    tags=["Results"],
    dependencies=[Depends(get_current_user)],
    responses={418: {"description": "I'm a teapot"}},
)

app.include_router(
    payments.router,
    prefix="/payments",
    tags=["Payments"],
    dependencies=[Depends(get_current_user)],
    responses={418: {"description": "I'm a teapot"}},
)

app.include_router(
    socket_resources.router
)

app.include_router(
    metadata.router,
    prefix="/metadata",
    tags=["Metadata"],
)

@app.get("/")
async def root():
    return RedirectResponse(url='/docs')


@app.get("/api/v1")
async def root():
    return {"message": "API_v1"}


# starts database connection
@app.on_event("startup")
async def startup():
    # initialize settings
    get_settings()

    # connect to the db
    await database.connect()

    # set up the faust app
    # worker.set_faust_app_for_api()

    # faust_app = worker.get_faust_app()

    # start the faust app in client mode
    # asyncio.create_task(
    #     faust_app.start_client()
    # )


# closes database connection
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

    # faust_app = worker.get_faust_app()

    # graceful shutdown
    # await faust_app.stop()
