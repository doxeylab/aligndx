from typing import Dict
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import subprocess 
import asyncio 

app = FastAPI(
    title="AlignDX",
    description="This is the restful API for the AlignDX application. Here you will find the auto docs genereated for the API endpoints",
    version="1.0",
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "This is the kraken2 container!"}

@app.post("/")
async def run(command : Dict[str, list]):   
    commands = " ".join(str(x) for x in command['commands'])
    proc = await asyncio.create_subprocess_shell(
        commands,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate() 
    if stdout:
        print("stdout:")
        print(stdout.decode())
        return stdout.decode()
    if stderr:
        print(f"commands were {commands}")
        print("stderr:")
        print(stderr.decode())
        return stderr.decode()