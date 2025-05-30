from typing import List
from fastapi import HTTPException
from .models import Country, CountryDetails
from .services import CountryService

class CountryController:
    """
    Controller layer for handling country-related business logic.
    Coordinates between the API routes and the service layer.
    """
    
    def __init__(self):
        self.country_service = CountryService()
    
    async def get_all_countries(self) -> List[Country]:
        """
        Controller method to get all countries.
        Handles the coordination between routes and services.
        """
        try:
            countries = await self.country_service.get_all_countries()
            return countries
        except HTTPException:
            # Re-raise HTTP exceptions from service layer
            raise
        except Exception as e:
            # Handle any unexpected errors at controller level
            raise HTTPException(
                status_code=500, 
                detail="Error processing countries request"
            )
    
    async def get_country_details(self, country_name: str) -> CountryDetails:
        """
        Controller method to get detailed country information.
        Validates input and coordinates with service layer.
        """
        # Input validation at controller level
        if not country_name or not country_name.strip():
            raise HTTPException(
                status_code=400, 
                detail="Country name cannot be empty"
            )
        
        # Normalize country name
        normalized_name = country_name.strip().lower()
        
        try:
            country_details = await self.country_service.get_country_by_name(normalized_name)
            return country_details
        except HTTPException:
            # Re-raise HTTP exceptions from service layer
            raise
        except Exception as e:
            # Handle any unexpected errors at controller level
            raise HTTPException(
                status_code=500, 
                detail=f"Error processing country details request for '{country_name}'"
            )
    
    async def validate_country_exists(self, country_name: str) -> bool:
        """
        Controller utility method to check if a country exists.
        Can be used for additional validation logic.
        """
        try:
            await self.country_service.get_country_by_name(country_name)
            return True
        except HTTPException as e:
            if e.status_code == 404:
                return False
            raise  # Re-raise non-404 errors 