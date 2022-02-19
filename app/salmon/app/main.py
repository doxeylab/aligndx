from typing import Dict
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import subprocess

# tags_metadata = [
#     {
#         "name": "uploads",
#         "description": "Accepts .fastq and .fastq.gz files. The **chunking** logic is also here.",
#     },
#     {
#         "name": "results",
#         "description": "Salmon _quantification_ of chunks.",
#         "externalDocs": {
#             "description": "Salmon docs",
#             "url": "https://salmon.readthedocs.io/en/latest/index.html",
#         },
#     },
#     {"name": "users", "description": "User endpoint - Login, Signup, User info"},
# ]

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0",
    # openapi_tags=tags_metadata,
)

# lst_origins = os.getenv("ORIGINS")
# origins = lst_origins.replace(" ", "").split(",")  

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(
#     uploads.router,
#     tags=["uploads"],
#     responses={408: {"description": "Ain't gonna work buddy"}},
# )


@app.get("/")
async def root():
    return {"message": "This is the salmon container!"}

# @app.post("/")
# def runsalmon(command : Dict[str, list]):  
#     commands = command['commands'] 
#     execute_salmon(commands)  
#     # background_tasks.add_task(execute_salmon, commands) 
#     return {"Result": "OK"}


# def execute_salmon(commands):
#     process = subprocess.Popen(commands, stdout=subprocess.PIPE)
#     logs = process.communicate()[0]
#     logs_decoded = logs.decode("utf-8") 
#     print(logs_decoded) 


import asyncio 

@app.post("/")
async def runsalmon(command : Dict[str, list]):   
    commands = " ".join(str(x) for x in command['commands'])
    proc = await asyncio.create_subprocess_shell(
        commands,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate() 
    if stdout:
        print("stdout:")
        print(stdout)
        return stdout
    if stderr:
        print("stderr:")
        print(stderr)
        return stderr  