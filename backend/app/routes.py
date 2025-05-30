from fastapi import APIRouter, Path
from typing import List
from .models import Country, CountryDetails
from .controllers import CountryController

router = APIRouter()
# Initialize the controller
country_controller = CountryController()

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
    HTTP route to retrieve all countries with basic information (name and flag).
    
    This route delegates to the CountryController for business logic.
    Returns a list of countries from the REST Countries API.
    """
    return await country_controller.get_all_countries()

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
        400: {
            "description": "Invalid country name"
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
    HTTP route to retrieve detailed information about a specific country by name.
    
    This route delegates to the CountryController for business logic.
    
    Args:
        name: The name of the country to retrieve details for
        
    Returns:
        Detailed information about the country including population, capital, etc.
    """
    return await country_controller.get_country_details(name) 