# python
from operator import ge
import os, asyncio 
import logging 

# fastapi
from fastapi import FastAPI, Depends, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.exceptions import RequestValidationError

# auth
from app.auth.auth_dependencies import get_current_user 

# routers
from app.api_v1.routers import uploads, results, users, socket_resources, metadata 
from app.api_v1.routers.payments import payments, stripe_webhooks

# settings
from app.config.settings import get_settings

# periodic tasks
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.celery.periodic_tasks import periodic_task_calls


app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0", 
)

@app.on_event('startup')
async def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.start()

    scheduler.add_job(periodic_task_calls, 'interval', seconds=30)

@app.on_event('startup')
async def setup_configs():
    '''
    Initializes settings for app
    '''
    get_settings()

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
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
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
    stripe_webhooks.router,
    prefix="/webhooks/stripe",
    tags=["Stripe Webhooks"],
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

# Stripe Publishable Key for front-end
@app.get("/stripe-key")
async def root():
    settings = get_settings()
    return {"key": settings.stripe_publishable_key}

from app.db.session import engine
@app.on_event("shutdown")
async def close_database_connection_pools() -> None:
    await engine.dispose()