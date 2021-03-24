from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
 
from routers import uploads, results

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
    return {"message": "Hello Bigger Applications!"}
 