from fastapi import APIRouter, HTTPException, Path
from typing import List
from .models import Country, CountryDetails, CountryListResponse
from .services import CountryService

router = APIRouter()
country_service = CountryService()

@router.get(
    "/countries", 
    response_model=List[Country],
    summary="Retrieve all countries",
    description="A list of countries",
    responses={
        200: {
            "description": "A list of countries",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/Country"}
                    }
                }
            }
        }
    }
)
async def get_countries():
    """
    Retrieve all countries with basic information (name and flag).
    
    Returns a list of countries from the REST Countries API.
    """
    countries = await country_service.get_all_countries()
    return countries

@router.get(
    "/countries/{name}",
    response_model=CountryDetails,
    summary="Retrieve details about a specific country", 
    description="Details about the country",
    responses={
        200: {
            "description": "Details about the country",
            "content": {
                "application/json": {
                    "schema": {"$ref": "#/components/schemas/CountryDetails"}
                }
            }
        },
        404: {
            "description": "Country not found"
        }
    }
)
async def get_country_details(
    name: str = Path(..., description="Country name", example="france")
):
    """
    Retrieve detailed information about a specific country by name.
    
    Args:
        name: The name of the country to retrieve details for
        
    Returns:
        Detailed information about the country including population, capital, etc.
    """
    country_details = await country_service.get_country_by_name(name)
    return country_details 