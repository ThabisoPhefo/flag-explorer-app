from pydantic import BaseModel
from typing import Optional, List

class Country(BaseModel):
    name: str
    capital: Optional[str] = None
    population: Optional[int] = None
    flag: Optional[str] = None
    code: str
    region: Optional[str] = None
    area: Optional[float] = None

class CountryList(BaseModel):
    countries: List[Country]
    total: int 