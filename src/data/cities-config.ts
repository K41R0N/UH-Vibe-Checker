import citiesData from './cities.json';

export interface CityConfig {
  name: string;
  countryCode: string;
  country: string;
  region?: string;
  slug: string;
  alternateNames?: string[];
  timezone?: string;
  isPopular?: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

// Map of country names to ISO country codes
const COUNTRY_CODES: Record<string, string> = {
  'Albania': 'AL',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Germany': 'DE',
  // Add more as needed
};

// Map of cities to their timezones
const CITY_TIMEZONES: Record<string, string> = {
  'barcelona': 'Europe/Madrid',
  'lisbon': 'Europe/Lisbon',
  'berlin': 'Europe/Berlin',
  'tirana': 'Europe/Tirane',
  // Add more as needed
};

// Generate supported cities from our JSON data
export const SUPPORTED_CITIES: CityConfig[] = Object.entries(citiesData).map(([key, data]) => ({
  name: data.name,
  country: data.country,
  countryCode: COUNTRY_CODES[data.country] || 'XX',
  slug: `${data.name.toLowerCase()}-${data.country.toLowerCase()}`.replace(/\s+/g, '-'),
  timezone: CITY_TIMEZONES[key] || 'UTC',
  isPopular: ['barcelona', 'lisbon', 'berlin'].includes(key) // Example popular cities
}));

// Utility functions
export const getCityBySlug = (slug: string): CityConfig | undefined => 
  SUPPORTED_CITIES.find(city => city.slug === slug);

export const getPopularCities = (): CityConfig[] => 
  SUPPORTED_CITIES.filter(city => city.isPopular);

export const getCityByName = (name: string): CityConfig | undefined =>
  SUPPORTED_CITIES.find(city => 
    city.name.toLowerCase() === name.toLowerCase() ||
    city.alternateNames?.some(alt => alt.toLowerCase() === name.toLowerCase())
  );

// Additional utility functions
export const getAllCountries = (): string[] =>
  Array.from(new Set(SUPPORTED_CITIES.map(city => city.country))).sort();

export const getCitiesByCountry = (country: string): CityConfig[] =>
  SUPPORTED_CITIES.filter(city => city.country === country);

export const getCountryCode = (country: string): string =>
  COUNTRY_CODES[country] || 'XX'; 