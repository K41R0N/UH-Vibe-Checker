export interface CityConfig {
  name: string;
  countryCode: string;
  region?: string;
  slug: string;
  alternateNames?: string[];
  timezone?: string;
  isPopular?: boolean;
}

export const SUPPORTED_CITIES: CityConfig[] = [
  {
    name: 'Barcelona',
    countryCode: 'ES',
    region: 'Catalonia',
    slug: 'barcelona-spain',
    alternateNames: ['BCN', 'Barna'],
    timezone: 'Europe/Madrid',
    isPopular: true
  },
  {
    name: 'Lisbon',
    countryCode: 'PT',
    region: 'Lisbon',
    slug: 'lisbon-portugal',
    alternateNames: ['Lisboa'],
    timezone: 'Europe/Lisbon',
    isPopular: true
  },
  // Add more cities...
];

// Utility functions for city data management
export const getCityBySlug = (slug: string) => 
  SUPPORTED_CITIES.find(city => city.slug === slug);

export const getPopularCities = () => 
  SUPPORTED_CITIES.filter(city => city.isPopular); 