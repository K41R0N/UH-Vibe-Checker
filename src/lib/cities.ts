import { City } from '../types/city';
import citiesData from '../data/cities.json';
import { SUPPORTED_CITIES, getCityBySlug as getConfigCity } from '../data/cities-config';

export const getCities = async (): Promise<City[]> => {
  // Get all supported cities and their data
  return SUPPORTED_CITIES.map(cityConfig => {
    const cityData = citiesData[cityConfig.name.toLowerCase()];
    return {
      ...cityData,
      metadata: {
        title: `Living in ${cityConfig.name}, ${cityConfig.country} - Digital Nomad Guide`,
        description: `Comprehensive guide to living in ${cityConfig.name}, ${cityConfig.country}. Explore cost of living, weather, quality of life and more in this vibrant ${cityConfig.country} city.`,
        keywords: [
          cityConfig.name.toLowerCase(),
          cityConfig.country.toLowerCase(),
          'digital nomad',
          'expat guide',
          'cost of living',
          'quality of life',
          `${cityConfig.name.toLowerCase()} weather`,
          `living in ${cityConfig.country.toLowerCase()}`
        ]
      }
    };
  });
};

export const getCityBySlug = async (slug: string): Promise<City | null> => {
  // Get city configuration
  const cityConfig = getConfigCity(slug);
  if (!cityConfig) return null;

  // Get city data
  const cityData = citiesData[cityConfig.name.toLowerCase()];
  if (!cityData) return null;

  return {
    ...cityData,
    metadata: {
      title: `Living in ${cityConfig.name}, ${cityConfig.country} - Digital Nomad Guide`,
      description: `Comprehensive guide to living in ${cityConfig.name}, ${cityConfig.country}. Explore cost of living, weather, quality of life and more in this vibrant ${cityConfig.country} city.`,
      keywords: [
        cityConfig.name.toLowerCase(),
        cityConfig.country.toLowerCase(),
        'digital nomad',
        'expat guide',
        'cost of living',
        'quality of life',
        `${cityConfig.name.toLowerCase()} weather`,
        `living in ${cityConfig.country.toLowerCase()}`
      ]
    }
  };
};

export const generateStaticPaths = async () => {
  return SUPPORTED_CITIES.map(city => ({
    params: { slug: city.slug }
  }));
}; 