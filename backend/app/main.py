from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from .routes import router

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Country API",
    description="A REST API for exploring country information using REST Countries data",
    version="1.0.0",
    openapi_version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default port
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, tags=["Countries"])

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint returning API information"""
    return {
        "message": "Country API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "countries": "/countries",
            "country_details": "/countries/{name}"
        }
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Country API"} 