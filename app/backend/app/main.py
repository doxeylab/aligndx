# python
import os, asyncio 

# fastapi
from fastapi import FastAPI, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

# auth
from app.auth.auth_dependencies import get_current_user 

# routers
from app.api_v1.routers import uploads, results, users

# db
from app.db.database import database

# streaming worker
import app.worker as worker

# settings
from app.config.settings import get_settings


tags_metadata = [
    {
        "name": "uploads",
        "description": "Accepts .fastq and .fastq.gz files. The **chunking** logic is also here.",
    },
    {
        "name": "results",
        "description": "Salmon _quantification_ of chunks.",
        "externalDocs": {
            "description": "Salmon docs",
            "url": "https://salmon.readthedocs.io/en/latest/index.html",
        },
    },
    {"name": "users", "description": "User endpoint - Login, Signup, User info"},
]

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0",
    openapi_tags=tags_metadata,
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
    uploads.router,
    prefix="/uploads",
    tags=["uploads"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)
app.include_router(
    results.router,
    prefix="/results",
    tags=["results"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)
app.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)

app.include_router(
    uploads.router,
    prefix="/auth",
    tags=["auth uploads"],
    dependencies=[Depends(get_current_user)],
    responses={418: {"description": "I'm a teapot"}},
)

app.include_router(
    results.router,
    prefix="/auth",
    tags=["auth results"],
    dependencies=[Depends(get_current_user)],
    responses={418: {"description": "I'm a teapot"}},
)

@app.get("/")
async def root():
    return RedirectResponse(url='/docs')


@app.get("/api/v1")
async def root():
    return RedirectResponse(url='/docs')


# starts database connection
@app.on_event("startup")
async def startup():
    # initialize settings
    get_settings()

    # connect to the db
    await database.connect()

    # set up the faust app
    worker.set_faust_app_for_api()

    faust_app = worker.get_faust_app()

    # start the faust app in client mode
    asyncio.create_task(
        faust_app.start_client()
    )


# closes database connection
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

    faust_app = worker.get_faust_app()

    # graceful shutdown
    await faust_app.stop()
