from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  

from app.api.api_v1.routers import uploads, results 
# from app.db.database import engine, metadata, database

# metadata.create_all(engine)

app = FastAPI()
 
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
]

app = FastAPI(
    title = 'AlignDX',
    description = "This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0",
    openapi_tags=tags_metadata
)
 

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# app.include_router(users.router)
app.include_router(uploads.router,
    prefix="/uploads",
    tags=["uploads"],
    # dependencies=[Depends(get_token_header)],
    responses={408: {"description": "Ain't gonna work buddy"}},
) 
app.include_router(results.router,
    prefix="/results",
    tags=["results"],
    # dependencies=[Depends(get_token_header)],
    responses={408: {"description": "Ain't gonna work buddy"}},
)

@app.get("/")
async def root():
    return {"message": "The root of the onion!"}
 
@app.get("/api/v1")
async def root():
    return {"message": "This is the root endpoint for version 1 of the api"}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)



# @app.on_event("startup")
# async def startup():
#     await database.connect()


# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()