#!/usr/bin/env python3
"""
Simple server startup script for the Country API.
This script can be run directly to start the FastAPI server.
"""

import sys
import subprocess
import os
import uvicorn

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Country API Server...")
    print("=" * 40)
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        print("🌐 Starting server on http://127.0.0.1:8001")
        print("📚 API Documentation: http://127.0.0.1:8001/docs")
        print("🔍 Health Check: http://127.0.0.1:8001/health")
        print("")
        print("Press Ctrl+C to stop the server")
        print("=" * 40)
        
        # Start the uvicorn server
        uvicorn.run(
            "app.main:app", 
            host="127.0.0.1", 
            port=8001, 
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n⚠️  Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        print("\n📋 Manual start instructions:")
        print("   uvicorn app.main:app --reload --host 127.0.0.1 --port 8001")
        sys.exit(1)

if __name__ == "__main__":
    start_server() 