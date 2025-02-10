import { CityData } from '../types/city';
import citiesJson from './cities.json';

// Type assertion to ensure proper typing
export const citiesData: Record<string, CityData> = citiesJson;

// Export utility functions for working with city data
export const getCityBySlug = (slug: string): CityData | undefined => {
  return Object.values(citiesData).find(city => city.slug === slug);
};

export const getAllCities = (): CityData[] => {
  return Object.values(citiesData);
};

export const getCitiesByCountry = (country: string): CityData[] => {
  return Object.values(citiesData).filter(city => city.country === country);
}; 