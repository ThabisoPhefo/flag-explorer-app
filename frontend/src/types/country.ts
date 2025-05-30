export interface Country {
  name: string;
  capital?: string;
  population?: number;
  flag?: string;
  code: string;
  region?: string;
  area?: number;
}

export interface CountryList {
  countries: Country[];
  total: number;
} 