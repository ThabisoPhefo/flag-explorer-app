import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Flag Explorer API"}

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_get_countries():
    """Test the get all countries endpoint"""
    response = client.get("/api/countries")
    assert response.status_code == 200
    data = response.json()
    assert "countries" in data
    assert "total" in data
    assert isinstance(data["countries"], list)
    assert isinstance(data["total"], int) 