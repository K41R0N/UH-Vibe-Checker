import { City } from '../../types/city';
import citiesData from '../../data/cities.json';
import { SUPPORTED_CITIES, getCityBySlug as getConfigCity } from '../../data/cities-config';
import { WeatherAPI } from '../api/providers/weather';

export class CityService {
  private static weatherAPI = new WeatherAPI();

  static async getCities(): Promise<City[]> {
    // Get all supported cities and their data
    const cities = await Promise.all(SUPPORTED_CITIES.map(async cityConfig => {
      const cityData = citiesData[cityConfig.name.toLowerCase()];
      
      // Try to get weather data, but don't let it break the app
      let weather;
      try {
        weather = await this.weatherAPI.getCityWeather(cityConfig.name);
      } catch (error) {
        console.error(`Failed to fetch weather for ${cityConfig.name}:`, error);
        // Weather will remain undefined, which is handled in the UI
      }

      return {
        ...cityData,
        weather,
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
    }));

    return cities.filter(city => city !== null);
  }

  static async getCityBySlug(slug: string): Promise<City | null> {
    // Get city configuration
    const cityConfig = getConfigCity(slug);
    if (!cityConfig) return null;

    // Get city data
    const cityData = citiesData[cityConfig.name.toLowerCase()];
    if (!cityData) return null;

    // Try to get weather data, but don't let it break the app
    let weather;
    try {
      weather = await this.weatherAPI.getCityWeather(cityConfig.name);
    } catch (error) {
      console.error(`Failed to fetch weather for ${cityConfig.name}:`, error);
      // Weather will remain undefined, which is handled in the UI
    }

    return {
      ...cityData,
      weather,
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
  }

  static generateStaticPaths() {
    // Return paths in the format Next.js expects
    return SUPPORTED_CITIES.map(city => ({
      params: {
        slug: `${city.name.toLowerCase()}-${city.country.toLowerCase()}`.replace(/\s+/g, '-')
      }
    }));
  }
} 