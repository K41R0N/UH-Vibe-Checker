import { City } from '../types/city';
import { DataService } from './api/dataService';
import { cityDatabase, getAllCities } from './data/cityDatabase';

const dataService = new DataService();

export const getCities = async (): Promise<City[]> => {
  const cities = await Promise.allSettled(
    getAllCities().map(async (cityInfo) => {
      try {
        const cityData = await dataService.getCityData(cityInfo.name);
        return {
          ...cityData,
          name: cityInfo.name,
          country: cityInfo.country,
          countryCode: cityInfo.countryCode,
          slug: cityInfo.name.toLowerCase(),
          description: cityInfo.description,
          metadata: {
            title: `Living in ${cityInfo.name}, ${cityInfo.country} - Digital Nomad Guide`,
            description: `Comprehensive guide to living in ${cityInfo.name}, ${cityInfo.country}. Explore cost of living, weather, quality of life and more in this vibrant ${cityInfo.country} city.`,
            keywords: [
              cityInfo.name.toLowerCase(),
              cityInfo.country.toLowerCase(),
              'digital nomad',
              'expat guide',
              'cost of living',
              'quality of life',
              `${cityInfo.name.toLowerCase()} weather`,
              `living in ${cityInfo.country.toLowerCase()}`
            ]
          }
        };
      } catch (error) {
        console.error(`Error fetching data for ${cityInfo.name}:`, error);
        return null;
      }
    })
  );

  return cities
    .filter((result): result is PromiseFulfilledResult<City> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
};

export const getCityBySlug = async (slug: string): Promise<City | null> => {
  const cityInfo = cityDatabase[slug.toLowerCase()];
  if (!cityInfo) return null;

  try {
    const cityData = await dataService.getCityData(cityInfo.name);
    return {
      ...cityData,
      name: cityInfo.name,
      country: cityInfo.country,
      countryCode: cityInfo.countryCode,
      slug: slug.toLowerCase(),
      description: cityInfo.description,
      metadata: {
        title: `Living in ${cityInfo.name}, ${cityInfo.country} - Digital Nomad Guide`,
        description: `Comprehensive guide to living in ${cityInfo.name}, ${cityInfo.country}. Explore cost of living, weather, quality of life and more in this vibrant ${cityInfo.country} city.`,
        keywords: [
          cityInfo.name.toLowerCase(),
          cityInfo.country.toLowerCase(),
          'digital nomad',
          'expat guide',
          'cost of living',
          'quality of life',
          `${cityInfo.name.toLowerCase()} weather`,
          `living in ${cityInfo.country.toLowerCase()}`
        ]
      }
    };
  } catch (error) {
    console.error('Error fetching city data:', error);
    return null;
  }
};

export const generateStaticPaths = async () => {
  return getAllCities().map(city => ({
    params: { slug: city.name.toLowerCase() }
  }));
}; 