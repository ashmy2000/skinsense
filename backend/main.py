from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes.analyse import router

load_dotenv()

app = FastAPI(title="SkinSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# health endpoint
@app.get("/")
def health_check():
    return {"status": "SkinSense API running"}

# register analyse routes
app.include_router(router)