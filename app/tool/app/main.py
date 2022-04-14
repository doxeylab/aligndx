from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess 
import asyncio 
import socket

title = socket.gethostname()

app = FastAPI(
    title=f'{title}',
    description=f'API for {title}',
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

@app.post("/")
async def run(commands_lst : list):   
    commands = " ".join(str(x) for x in commands_lst)
    print(f"The commands were: {commands}")
    proc = await asyncio.create_subprocess_shell(
        commands,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate()  
    
    if proc.returncode != 0:
        raise HTTPException(status_code=400, detail=stderr.decode())
    else:
        return stdout
        