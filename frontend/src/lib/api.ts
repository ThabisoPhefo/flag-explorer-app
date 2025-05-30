import { Country, CountryDetails, CountryList } from '@/types/country';

// Backend API base URL - using the port where our backend is running
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

/**
 * Fetch all countries with basic information (name and flag)
 * Connects to our backend API which handles the external REST Countries API
 */
export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('Failed to load countries. Please try again.');
  }
}

/**
 * Fetch detailed information about a specific country by name
 * Connects to our backend API for country details
 */
export async function getCountryByName(name: string): Promise<CountryDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries/${encodeURIComponent(name)}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Country "${name}" not found`);
      }
      throw new Error(`Failed to fetch country details: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching country details:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load country details. Please try again.');
  }
}

/**
 * Legacy function for backward compatibility
 * Now uses our backend instead of direct external API calls
 */
export async function getAllFlags(): Promise<Array<{ name: string; flag: string; code: string }>> {
  try {
    const countries = await getAllCountries();
    return countries.map((country) => ({
      name: country.name,
      flag: country.flag,
      code: country.name.slice(0, 2).toUpperCase() // Fallback code generation
    }));
  } catch (error) {
    console.error('Error fetching flags:', error);
    throw new Error('Failed to load country flags. Please try again.');
  }
}

/**
 * Health check for the backend API
 */
export async function checkApiHealth(): Promise<{ status: string; service: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
} 