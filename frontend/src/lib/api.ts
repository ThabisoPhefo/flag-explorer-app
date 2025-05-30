import { Country, CountryList } from '@/types/country';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getAllCountries(): Promise<CountryList> {
  const response = await fetch(`${API_BASE_URL}/api/countries`);
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
}

export async function getCountryByName(name: string): Promise<Country> {
  const response = await fetch(`${API_BASE_URL}/api/countries/${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch country details');
  }
  return response.json();
}

// Fetch flag images from the external API
export async function getAllFlags(): Promise<Array<{ name: string; flag: string; code: string }>> {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
  if (!response.ok) {
    throw new Error('Failed to fetch flags');
  }
  const data = await response.json();
  
  return data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.png,
    code: country.cca2
  }));
} 