from app.api_v1.routers import uploads, results, users
from app.db.database import database
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

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
    tags=["uploads"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)
app.include_router(
    results.router,
    tags=["results"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)
app.include_router(
    users.router,
    tags=["users"],
    responses={408: {"description": "Ain't gonna work buddy"}},
)


@app.get("/")
async def root():
    return {"message": "The root of the onion!"}


@app.get("/api/v1")
async def root():
    return {"message": "This is the root endpoint for version 1 of the api"}


# starts database connection
@app.on_event("startup")
async def startup():
    await database.connect()


# closes database connection
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
