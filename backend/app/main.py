import os 
import logging 

from fastapi import FastAPI, Depends, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.api.routers import users, submissons, sockets, metadata, payments, webhooks

from app.services.auth import get_current_user
from app.services.factory import initialize
from app.core import utils

from app.core.config.settings import get_settings

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0"
)

@app.on_event('startup')
async def setup_configs():
    '''
    Initializes settings for app
    '''
    settings = get_settings()
    utils.dir_generator(settings.DIRS)
    initialize()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

lst_origins = os.getenv("ORIGINS")
origins = lst_origins.replace(" ", "").split(",")  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"]
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
    # include_in_schema=False,
)
 
app.include_router(
    submissons.router,
    prefix="/submissions",
    tags=["Submissions"],
    dependencies=[Depends(get_current_user)],
)

app.include_router(
    payments.router,
    prefix="/payments",
    tags=["Payments"],
    # include_in_schema=False,
    dependencies=[Depends(get_current_user)],
)

app.include_router(
    metadata.router,
    prefix="/metadata",
    tags=["Metadata"],
)

app.include_router(
    sockets.router
)
 
app.include_router(
    webhooks.router,
    prefix="/webhooks",
    # include_in_schema=False,
    tags=["Webhooks"]
)

@app.get("/")
async def root():
    return RedirectResponse(url='/docs')

from app.core.db.session import engine
@app.on_event("shutdown")
async def close_database_connection_pools() -> None:
    await engine.dispose()