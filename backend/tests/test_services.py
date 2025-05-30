import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import httpx
from fastapi import HTTPException
from app.services import CountryService
from app.models import Country, CountryDetails

@pytest.fixture
def country_service():
    """Fixture to create a CountryService instance"""
    return CountryService()

@pytest.fixture
def mock_countries_api_response():
    """Mock response from REST Countries API for all countries"""
    return [
        {
            "name": {"common": "France"},
            "flags": {"png": "https://flagcdn.com/w320/fr.png"},
            "population": 67391582,
            "capital": ["Paris"],
            "region": "Europe",
            "area": 551695.0,
            "cca2": "FR"
        },
        {
            "name": {"common": "Germany"},
            "flags": {"png": "https://flagcdn.com/w320/de.png"},
            "population": 83240525,
            "capital": ["Berlin"],
            "region": "Europe", 
            "area": 357022.0,
            "cca2": "DE"
        }
    ]

@pytest.fixture
def mock_country_api_response():
    """Mock response from REST Countries API for single country"""
    return [
        {
            "name": {"common": "France"},
            "flags": {"png": "https://flagcdn.com/w320/fr.png"},
            "population": 67391582,
            "capital": ["Paris"],
            "region": "Europe",
            "area": 551695.0,
            "cca2": "FR"
        }
    ]

class TestCountryService:
    """Test suite for CountryService"""

    @pytest.mark.asyncio
    async def test_get_all_countries_success(self, country_service, mock_countries_api_response):
        """Test successful retrieval of all countries"""
        mock_response = MagicMock()
        mock_response.json.return_value = mock_countries_api_response
        mock_response.raise_for_status = MagicMock()
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
            
            countries = await country_service.get_all_countries()
            
            assert len(countries) == 2
            assert isinstance(countries[0], Country)
            assert countries[0].name == "France"
            assert countries[0].flag == "https://flagcdn.com/w320/fr.png"
            assert countries[1].name == "Germany"

    @pytest.mark.asyncio
    async def test_get_all_countries_filters_invalid_data(self, country_service):
        """Test that invalid country data is filtered out"""
        invalid_response = [
            {
                "name": {"common": "Valid Country"},
                "flags": {"png": "https://flagcdn.com/w320/valid.png"}
            },
            {
                "name": {"common": "Unknown"},  # Should be filtered
                "flags": {"png": ""}
            },
            {
                "name": {},  # Invalid name structure
                "flags": {"png": "https://flagcdn.com/w320/invalid.png"}
            }
        ]
        
        mock_response = MagicMock()
        mock_response.json.return_value = invalid_response
        mock_response.raise_for_status = MagicMock()
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
            
            countries = await country_service.get_all_countries()
            
            assert len(countries) == 1  # Only the valid country
            assert countries[0].name == "Valid Country"

    @pytest.mark.asyncio
    async def test_get_all_countries_http_error(self, country_service):
        """Test handling of HTTP errors when fetching all countries"""
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.HTTPError("Connection failed")
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_all_countries()
            
            assert exc_info.value.status_code == 502
            assert "Error fetching countries from external service" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_all_countries_timeout(self, country_service):
        """Test handling of timeout when fetching all countries"""
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.TimeoutException("Request timeout")
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_all_countries()
            
            assert exc_info.value.status_code == 504
            assert "Service timeout while fetching countries" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_by_name_success(self, country_service, mock_country_api_response):
        """Test successful retrieval of country by name"""
        mock_response = MagicMock()
        mock_response.json.return_value = mock_country_api_response
        mock_response.raise_for_status = MagicMock()
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
            
            country = await country_service.get_country_by_name("france")
            
            assert isinstance(country, CountryDetails)
            assert country.name == "France"
            assert country.population == 67391582
            assert country.capital == "Paris"
            assert country.flag == "https://flagcdn.com/w320/fr.png"
            assert country.region == "Europe"
            assert country.area == 551695.0
            assert country.code == "FR"

    @pytest.mark.asyncio
    async def test_get_country_by_name_no_capital(self, country_service):
        """Test handling of country with no capital"""
        response_no_capital = [
            {
                "name": {"common": "Antarctica"},
                "flags": {"png": "https://flagcdn.com/w320/aq.png"},
                "population": 1000,
                "capital": [],  # No capital
                "region": "Antarctic",
                "area": 14000000.0,
                "cca2": "AQ"
            }
        ]
        
        mock_response = MagicMock()
        mock_response.json.return_value = response_no_capital
        mock_response.raise_for_status = MagicMock()
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
            
            country = await country_service.get_country_by_name("antarctica")
            
            assert country.capital is None

    @pytest.mark.asyncio
    async def test_get_country_by_name_not_found(self, country_service):
        """Test handling of country not found"""
        mock_response = MagicMock()
        mock_response.json.return_value = []  # Empty response
        mock_response.raise_for_status = MagicMock()
        
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_country_by_name("invalid")
            
            assert exc_info.value.status_code == 404
            assert "Country 'invalid' not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_by_name_http_404(self, country_service):
        """Test handling of 404 HTTP error from external API"""
        with patch('httpx.AsyncClient') as mock_client:
            http_error = httpx.HTTPError("Not found")
            http_error.response = MagicMock()
            http_error.response.status_code = 404
            
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(side_effect=http_error)
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_country_by_name("invalid")
            
            assert exc_info.value.status_code == 404
            assert "Country 'invalid' not found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_by_name_timeout(self, country_service):
        """Test handling of timeout when fetching country by name"""
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=httpx.TimeoutException("Request timeout")
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_country_by_name("france")
            
            assert exc_info.value.status_code == 504
            assert "Service timeout while fetching country details" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_by_name_unexpected_error(self, country_service):
        """Test handling of unexpected errors"""
        with patch('httpx.AsyncClient') as mock_client:
            mock_client.return_value.__aenter__.return_value.get = AsyncMock(
                side_effect=Exception("Unexpected error")
            )
            
            with pytest.raises(HTTPException) as exc_info:
                await country_service.get_country_by_name("france")
            
            assert exc_info.value.status_code == 500
            assert "Internal server error" in exc_info.value.detail 