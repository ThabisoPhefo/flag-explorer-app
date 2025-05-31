import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.models import Country, CountryDetails

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Country API"
    assert data["version"] == "1.0.0"
    assert "endpoints" in data

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Country API"

@pytest.mark.asyncio
async def test_get_countries_success():
    """Test successful retrieval of all countries"""
    # Mock the service response
    mock_countries = [
        Country(name="France", flag="https://flagcdn.com/w320/fr.png", population=67391582),
        Country(name="Germany", flag="https://flagcdn.com/w320/de.png", population=83240525)
    ]
    
    with patch('app.services.CountryService.get_all_countries', new_callable=AsyncMock) as mock_service:
        mock_service.return_value = mock_countries
        
        response = client.get("/countries")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]["name"] == "France"
        assert data[0]["flag"] == "https://flagcdn.com/w320/fr.png"
        assert data[1]["name"] == "Germany"

@pytest.mark.asyncio
async def test_get_countries_service_error():
    """Test handling of service errors when fetching countries"""
    with patch('app.services.CountryService.get_all_countries', new_callable=AsyncMock) as mock_service:
        from fastapi import HTTPException
        mock_service.side_effect = HTTPException(status_code=502, detail="Service error")
        
        response = client.get("/countries")
        assert response.status_code == 502

@pytest.mark.asyncio 
async def test_get_country_by_name_success():
    """Test successful retrieval of country details by name"""
    mock_country_details = CountryDetails(
        name="France",
        population=67391582,
        capital="Paris",
        flag="https://flagcdn.com/w320/fr.png",
        region="Europe",
        area=551695.0,
        code="FR"
    )
    
    with patch('app.services.CountryService.get_country_by_name', new_callable=AsyncMock) as mock_service:
        mock_service.return_value = mock_country_details
        
        response = client.get("/countries/france")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "France"
        assert data["population"] == 67391582
        assert data["capital"] == "Paris"
        assert data["flag"] == "https://flagcdn.com/w320/fr.png"
        assert data["region"] == "Europe"
        assert data["area"] == 551695.0
        assert data["code"] == "FR"

@pytest.mark.asyncio
async def test_get_country_by_name_not_found():
    """Test handling of country not found error"""
    with patch('app.services.CountryService.get_country_by_name', new_callable=AsyncMock) as mock_service:
        from fastapi import HTTPException
        mock_service.side_effect = HTTPException(status_code=404, detail="Country 'invalid' not found")
        
        response = client.get("/countries/invalid")
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()

@pytest.mark.asyncio
async def test_get_country_by_name_service_error():
    """Test handling of service errors when fetching country details"""
    with patch('app.services.CountryService.get_country_by_name', new_callable=AsyncMock) as mock_service:
        from fastapi import HTTPException
        mock_service.side_effect = HTTPException(status_code=502, detail="Service error")
        
        response = client.get("/countries/france")
        assert response.status_code == 502

def test_openapi_documentation():
    """Test that OpenAPI documentation is available"""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/openapi.json")
    assert response.status_code == 200
    openapi_spec = response.json()
    assert openapi_spec["info"]["title"] == "Country API"
    assert openapi_spec["info"]["version"] == "1.0.0" 