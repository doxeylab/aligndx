from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware 
import uvicorn

from app.api.api_v1.routers import uploads, results

app = FastAPI()
 

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
app.include_router(uploads.router) 
app.include_router(results.router)

@app.get("/")
async def root():
    return {"message": "The root of the onion!"}
 
@app.get("/api/v1")
async def root():
    return {"message": "This is the root endpoint for version 1 of the api"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
