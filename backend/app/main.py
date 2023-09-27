import os
import logging

from fastapi import FastAPI, Depends, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.api.routers import users, submissions, sockets, payments, webhooks

from app.services.auth import get_current_user

from app.core.config.settings import get_settings
from app.core.db.session import engine


app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs generated for the API endpoints",
    version="1.0",
)


@app.on_event("startup")
async def setup_configs():
    """
    Initializes settings for app
    """
    get_settings()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logging.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


lst_origins = os.getenv("ORIGINS")
origins = lst_origins.replace(" ", "").split(",") if lst_origins is not None else None

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["content-disposition"],
)

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
    # include_in_schema=False,
)

app.include_router(
    submissions.router,
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

app.include_router(sockets.router)

app.include_router(
    webhooks.router,
    prefix="/webhooks",
    # include_in_schema=False,
    tags=["Webhooks"],
)


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


@app.on_event("shutdown")
async def close_database_connection_pools() -> None:
    await engine.dispose()
