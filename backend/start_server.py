#!/usr/bin/env python3
"""
Simple server startup script for the Country API.
This script can be run directly without installing dependencies globally.
"""

import sys
import subprocess
import os

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Country API Server...")
    print("=" * 40)
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        print("📋 To install dependencies in a virtual environment:")
        print("   python3 -m venv venv")
        print("   source venv/bin/activate")
        print("   pip install -r requirements.txt")
        print("")
        print("📋 To run the server:")
        print("   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        print("")
        print("📋 The API will be available at:")
        print("   • API: http://localhost:8000")
        print("   • Docs: http://localhost:8000/docs")
        print("   • Health: http://localhost:8000/health")
        print("")
        print("📋 Example API calls:")
        print("   curl http://localhost:8000/countries")
        print("   curl http://localhost:8000/countries/france")
        
    except KeyboardInterrupt:
        print("\n⚠️  Startup interrupted by user")
        sys.exit(1)

if __name__ == "__main__":
    start_server() 