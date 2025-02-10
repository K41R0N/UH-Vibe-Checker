import type { City } from '@/types/city';

export const SUPPORTED_CITIES: City[] = [
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
  },
  {
    slug: 'berlin',
    name: 'Berlin',
    country: 'Germany',
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
  },
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
  },
];

// Map of country names to ISO country codes
const COUNTRY_CODES: Record<string, string> = {
  'Albania': 'AL',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Germany': 'DE',
  'United States': 'US',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Italy': 'IT',
  // Add more as needed
};

// Map of cities to their timezones
const CITY_TIMEZONES: Record<string, string> = {
  'barcelona-spain': 'Europe/Madrid',
  'lisbon-portugal': 'Europe/Lisbon',
  'berlin-germany': 'Europe/Berlin',
  'london-united-kingdom': 'Europe/London',
  'paris-france': 'Europe/Paris',
  'rome-italy': 'Europe/Rome',
  'new-york-united-states': 'America/New_York',
  // Add more as needed
};

const generateSlug = (name: string, country: string): string => {
  if (!name || !country) {
    throw new Error(`Invalid city data: name=${name}, country=${country}`);
  }
  return `${name.toLowerCase()}-${country.toLowerCase()}`
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

type CityDataEntry = {
  name: string;
  country: string;
  slug: string;
  [key: string]: any;
};

// Generate supported cities from our JSON data
export const SUPPORTED_CITIES_JSON: CityConfig[] = Object.values(citiesData).map((cityData: CityDataEntry) => ({
  name: cityData.name,
  country: cityData.country,
  countryCode: COUNTRY_CODES[cityData.country] || 'XX',
  slug: generateSlug(cityData.name, cityData.country),
  timezone: CITY_TIMEZONES[generateSlug(cityData.name, cityData.country)] || 'UTC',
  isPopular: true // All cities in our database are considered available
}));

// Utility functions
export const getCityBySlug = (slug: string): CityConfig | undefined => {
  // First try exact match
  let city = SUPPORTED_CITIES_JSON.find(city => city.slug === slug);
  
  if (!city) {
    // If not found, try matching just the city part (for backward compatibility)
    city = SUPPORTED_CITIES_JSON.find(city => {
      const cityPart = city.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return cityPart === slug;
    });
  }

  return city;
};

export const getPopularCities = (): CityConfig[] => 
  SUPPORTED_CITIES_JSON.filter(city => city.isPopular);

export const getCityByName = (name: string): CityConfig | undefined => {
  const normalizedName = name.toLowerCase();
  return SUPPORTED_CITIES_JSON.find(city => 
    city.name.toLowerCase() === normalizedName ||
    city.alternateNames?.some(alt => alt.toLowerCase() === normalizedName)
  );
};

// Additional utility functions
export const getAllCountries = (): string[] =>
  Array.from(new Set(SUPPORTED_CITIES_JSON.map(city => city.country))).sort();

export const getCitiesByCountry = (country: string): CityConfig[] =>
  SUPPORTED_CITIES_JSON.filter(city => city.country === country);

export const getCountryCode = (country: string): string =>
  COUNTRY_CODES[country] || 'XX'; 