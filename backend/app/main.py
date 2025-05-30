from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .routes import router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Flag Explorer API",
    description="A REST API for exploring country flags and information",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Flag Explorer API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 