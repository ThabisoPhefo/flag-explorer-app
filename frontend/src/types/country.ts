// Types matching the backend API exactly

export interface Country {
  name: string;
  flag: string;
  population: number;
  region?: string;
}

export interface CountryDetails {
  name: string;
  population: number;
  capital?: string;
  flag: string;
  region?: string;
  area?: number;
  code?: string;
}

// For backward compatibility with existing components
export interface CountryList {
  countries: Country[];
  total: number;
} 