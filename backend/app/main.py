import os 
import logging 

from fastapi import FastAPI, Depends, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.auth.auth_dependencies import get_current_user, ValidateService

from app.api.routers import users, uploads, submissons, sockets, metadata, celery
from app.api.routers.payments import payments, stripe_webhooks

# utils
from app.core import utils

# settings
from app.core.config.settings import get_settings

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0", 
    root_path="/api/"
)

@app.on_event('startup')
async def setup_configs():
    '''
    Initializes settings for app
    '''
    settings = get_settings()
    utils.dir_generator(settings.DIRS)

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
    submissons.router,
    prefix="/submissions",
    tags=["Submissions"],
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
    sockets.router
)

app.include_router(
    metadata.router,
    prefix="/metadata",
    tags=["Metadata"],
)

app.include_router(
    celery.router,
    prefix="/celery",
    tags=["Celery"],
    dependencies=[Depends(ValidateService("celery"))],
)

@app.get("/")
async def root():
    return RedirectResponse(url='/api/docs')


@app.get("/api/v1")
async def root():
    return {"message": "API_v1"}

# Stripe Publishable Key for front-end
@app.get("/stripe-key")
async def root():
    settings = get_settings()
    return {"key": settings.stripe_publishable_key}

from app.core.db.session import engine
@app.on_event("shutdown")
async def close_database_connection_pools() -> None:
    await engine.dispose()