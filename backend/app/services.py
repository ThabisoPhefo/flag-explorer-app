import httpx
from typing import List, Optional
from fastapi import HTTPException
import logging
from .models import Country, CountryDetails

logger = logging.getLogger(__name__)

class CountryService:
    """Service layer for country operations"""
    
    def __init__(self):
        self.base_url = "https://restcountries.com/v3.1"
        self.timeout = 30.0
    
    async def get_all_countries(self) -> List[Country]:
        """Retrieve all countries with basic information"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/all")
                response.raise_for_status()
                
            countries_data = response.json()
            countries = []
            
            for country_data in countries_data:
                try:
                    # Extract basic country information as per Swagger spec
                    name = country_data.get("name", {}).get("common", "Unknown")
                    flag = country_data.get("flags", {}).get("png", "")
                    
                    if name != "Unknown" and flag:  # Only include countries with valid data
                        country = Country(name=name, flag=flag)
                        countries.append(country)
                except Exception as e:
                    logger.warning(f"Error processing country data: {e}")
                    continue
            
            return countries
            
        except httpx.TimeoutException:
            logger.error("Timeout while fetching countries")
            raise HTTPException(status_code=504, detail="Service timeout while fetching countries")
        except httpx.HTTPError as e:
            logger.error(f"HTTP error while fetching countries: {e}")
            raise HTTPException(status_code=502, detail="Error fetching countries from external service")
        except Exception as e:
            logger.error(f"Unexpected error while fetching countries: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")
    
    async def get_country_by_name(self, country_name: str) -> CountryDetails:
        """Retrieve detailed information about a specific country"""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Use name endpoint for exact matching
                response = await client.get(f"{self.base_url}/name/{country_name}?fullText=true")
                response.raise_for_status()
            
            countries_data = response.json()
            
            if not countries_data:
                raise HTTPException(status_code=404, detail=f"Country '{country_name}' not found")
            
            country_data = countries_data[0]  # Take the first match
            
            # Extract detailed country information as per Swagger spec
            name = country_data.get("name", {}).get("common", "Unknown")
            population = country_data.get("population", 0)
            capital = None
            if country_data.get("capital") and len(country_data.get("capital", [])) > 0:
                capital = country_data.get("capital")[0]
            
            flag = country_data.get("flags", {}).get("png", "")
            region = country_data.get("region")
            area = country_data.get("area")
            code = country_data.get("cca2")
            
            country_details = CountryDetails(
                name=name,
                population=population,
                capital=capital,
                flag=flag,
                region=region,
                area=area,
                code=code
            )
            
            return country_details
            
        except httpx.TimeoutException:
            logger.error(f"Timeout while fetching country: {country_name}")
            raise HTTPException(status_code=504, detail="Service timeout while fetching country details")
        except httpx.HTTPError as e:
            if e.response and e.response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"Country '{country_name}' not found")
            logger.error(f"HTTP error while fetching country {country_name}: {e}")
            raise HTTPException(status_code=502, detail="Error fetching country details from external service")
        except Exception as e:
            logger.error(f"Unexpected error while fetching country {country_name}: {e}")
            raise HTTPException(status_code=500, detail="Internal server error") 