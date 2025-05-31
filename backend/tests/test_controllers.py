import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.controllers import CountryController
from app.models import Country, CountryDetails

@pytest.fixture
def country_controller():
    """Fixture to create a CountryController instance"""
    return CountryController()

class TestCountryController:
    """Test suite for CountryController"""

    @pytest.mark.asyncio
    async def test_get_all_countries_success(self, country_controller):
        """Test successful retrieval of all countries via controller"""
        mock_countries = [
            Country(name="France", flag="https://flagcdn.com/w320/fr.png", population=67391582),
            Country(name="Germany", flag="https://flagcdn.com/w320/de.png", population=83240525)
        ]
        
        with patch.object(country_controller.country_service, 'get_all_countries', new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_countries
            
            result = await country_controller.get_all_countries()
            
            assert len(result) == 2
            assert result[0].name == "France"
            assert result[1].name == "Germany"
            mock_service.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_all_countries_service_error(self, country_controller):
        """Test controller handling of service errors"""
        with patch.object(country_controller.country_service, 'get_all_countries', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = HTTPException(status_code=502, detail="Service error")
            
            with pytest.raises(HTTPException) as exc_info:
                await country_controller.get_all_countries()
            
            assert exc_info.value.status_code == 502

    @pytest.mark.asyncio
    async def test_get_all_countries_unexpected_error(self, country_controller):
        """Test controller handling of unexpected errors"""
        with patch.object(country_controller.country_service, 'get_all_countries', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = Exception("Unexpected error")
            
            with pytest.raises(HTTPException) as exc_info:
                await country_controller.get_all_countries()
            
            assert exc_info.value.status_code == 500
            assert "Error processing countries request" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_details_success(self, country_controller):
        """Test successful retrieval of country details via controller"""
        mock_country = CountryDetails(
            name="France",
            population=67391582,
            capital="Paris",
            flag="https://flagcdn.com/w320/fr.png",
            region="Europe",
            area=551695.0,
            code="FR"
        )
        
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_country
            
            result = await country_controller.get_country_details("France")
            
            assert result.name == "France"
            assert result.population == 67391582
            assert result.capital == "Paris"
            # Verify service was called with normalized name
            mock_service.assert_called_once_with("france")

    @pytest.mark.asyncio
    async def test_get_country_details_empty_name(self, country_controller):
        """Test controller validation for empty country name"""
        with pytest.raises(HTTPException) as exc_info:
            await country_controller.get_country_details("")
        
        assert exc_info.value.status_code == 400
        assert "Country name cannot be empty" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_details_whitespace_name(self, country_controller):
        """Test controller validation for whitespace-only country name"""
        with pytest.raises(HTTPException) as exc_info:
            await country_controller.get_country_details("   ")
        
        assert exc_info.value.status_code == 400
        assert "Country name cannot be empty" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_country_details_name_normalization(self, country_controller):
        """Test that controller normalizes country names"""
        mock_country = CountryDetails(
            name="France",
            population=67391582,
            capital="Paris",
            flag="https://flagcdn.com/w320/fr.png",
            region="Europe",
            area=551695.0,
            code="FR"
        )
        
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_country
            
            # Test with mixed case and whitespace
            await country_controller.get_country_details("  FRANCE  ")
            
            # Verify service was called with normalized name
            mock_service.assert_called_once_with("france")

    @pytest.mark.asyncio
    async def test_get_country_details_not_found(self, country_controller):
        """Test controller handling of country not found"""
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = HTTPException(status_code=404, detail="Country not found")
            
            with pytest.raises(HTTPException) as exc_info:
                await country_controller.get_country_details("invalid")
            
            assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_get_country_details_unexpected_error(self, country_controller):
        """Test controller handling of unexpected errors in country details"""
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = Exception("Unexpected error")
            
            with pytest.raises(HTTPException) as exc_info:
                await country_controller.get_country_details("france")
            
            assert exc_info.value.status_code == 500
            assert "Error processing country details request for 'france'" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_validate_country_exists_true(self, country_controller):
        """Test country validation when country exists"""
        mock_country = CountryDetails(
            name="France",
            population=67391582,
            capital="Paris",
            flag="https://flagcdn.com/w320/fr.png",
            region="Europe",
            area=551695.0,
            code="FR"
        )
        
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.return_value = mock_country
            
            result = await country_controller.validate_country_exists("france")
            
            assert result is True

    @pytest.mark.asyncio
    async def test_validate_country_exists_false(self, country_controller):
        """Test country validation when country doesn't exist"""
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = HTTPException(status_code=404, detail="Country not found")
            
            result = await country_controller.validate_country_exists("invalid")
            
            assert result is False

    @pytest.mark.asyncio
    async def test_validate_country_exists_service_error(self, country_controller):
        """Test country validation with service errors (non-404)"""
        with patch.object(country_controller.country_service, 'get_country_by_name', new_callable=AsyncMock) as mock_service:
            mock_service.side_effect = HTTPException(status_code=502, detail="Service error")
            
            with pytest.raises(HTTPException) as exc_info:
                await country_controller.validate_country_exists("france")
            
            assert exc_info.value.status_code == 502 