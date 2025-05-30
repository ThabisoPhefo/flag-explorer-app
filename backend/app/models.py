from pydantic import BaseModel
from typing import Optional, List

class Country(BaseModel):
    """Basic country information for the countries list"""
    name: str
    flag: str

class CountryDetails(BaseModel):
    """Detailed country information for individual country queries"""
    name: str
    population: int
    capital: Optional[str] = None
    flag: str
    region: Optional[str] = None
    area: Optional[float] = None
    code: Optional[str] = None

class CountryListResponse(BaseModel):
    """Response model for countries list endpoint"""
    countries: List[Country]
    total: int 