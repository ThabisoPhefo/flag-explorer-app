from fastapi import APIRouter, HTTPException
import httpx
from typing import List, Optional
from .models import Country, CountryList

router = APIRouter()

RESTCOUNTRIES_BASE_URL = "https://restcountries.com/v3.1"

@router.get("/countries", response_model=CountryList)
async def get_all_countries():
    """Get all countries with basic information"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{RESTCOUNTRIES_BASE_URL}/all")
            response.raise_for_status()
            
        countries_data = response.json()
        countries = []
        
        for country_data in countries_data:
            country = Country(
                name=country_data.get("name", {}).get("common", "Unknown"),
                capital=country_data.get("capital", [None])[0] if country_data.get("capital") else None,
                population=country_data.get("population"),
                flag=country_data.get("flags", {}).get("png"),
                code=country_data.get("cca2", ""),
                region=country_data.get("region"),
                area=country_data.get("area")
            )
            countries.append(country)
        
        return CountryList(countries=countries, total=len(countries))
    
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching countries: {str(e)}")

@router.get("/countries/{country_name}", response_model=Country)
async def get_country_by_name(country_name: str):
    """Get detailed information about a specific country"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{RESTCOUNTRIES_BASE_URL}/name/{country_name}")
            response.raise_for_status()
        
        countries_data = response.json()
        
        if not countries_data:
            raise HTTPException(status_code=404, detail="Country not found")
        
        country_data = countries_data[0]  # Take the first match
        
        country = Country(
            name=country_data.get("name", {}).get("common", "Unknown"),
            capital=country_data.get("capital", [None])[0] if country_data.get("capital") else None,
            population=country_data.get("population"),
            flag=country_data.get("flags", {}).get("png"),
            code=country_data.get("cca2", ""),
            region=country_data.get("region"),
            area=country_data.get("area")
        )
        
        return country
    
    except httpx.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Country not found")
        raise HTTPException(status_code=500, detail=f"Error fetching country: {str(e)}") 