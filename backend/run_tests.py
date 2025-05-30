#!/usr/bin/env python3
"""
Test runner script for the Country API backend.
Run this script to execute all tests with coverage reporting.
"""

import subprocess
import sys
import os

def run_tests():
    """Run all tests with coverage"""
    print("🧪 Running Country API Backend Tests...")
    print("=" * 50)
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        # Install test dependencies if not already installed
        print("📦 Installing test dependencies...")
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "pytest", "pytest-asyncio", "pytest-cov"
        ], check=True, capture_output=True)
        
        # Run tests with coverage
        print("\n🔍 Running tests with coverage...")
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "-v", 
            "--cov=app", 
            "--cov-report=term-missing",
            "--cov-report=html:htmlcov"
        ], capture_output=False)
        
        if result.returncode == 0:
            print("\n✅ All tests passed!")
            print("📊 Coverage report saved to htmlcov/index.html")
        else:
            print("\n❌ Some tests failed!")
            sys.exit(1)
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running tests: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        sys.exit(1)

if __name__ == "__main__":
    run_tests() 