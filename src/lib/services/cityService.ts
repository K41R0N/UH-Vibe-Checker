import { City, CityData } from '@/types/city';
import citiesData from '@/data/cities.json';
import { SUPPORTED_CITIES, getCityBySlug as getConfigCity } from '@/data/cities-config';
import { WeatherAPI } from '../api/providers/weather';

type RawCitiesData = {
  [key: string]: CityData;
};

const ITEMS_PER_PAGE = 20;

export class CityService {
  private static weatherAPI = new WeatherAPI();
  private static weatherCache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private static apiCallsToday = 0;
  private static lastApiCallReset = new Date().setHours(0, 0, 0, 0);
  private static MAX_API_CALLS_PER_DAY = 950; // Setting slightly below 1000 for safety

  private static generateSlug(name: string, country: string): string {
    if (!name || !country) {
      throw new Error(`Invalid city data: name=${name}, country=${country}`);
    }
    return `${name.toLowerCase()}-${country.toLowerCase()}`
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private static resetApiCallsIfNewDay() {
    const today = new Date().setHours(0, 0, 0, 0);
    if (today > this.lastApiCallReset) {
      this.apiCallsToday = 0;
      this.lastApiCallReset = today;
    }
  }

  private static async getWeatherData(cityName: string) {
    this.resetApiCallsIfNewDay();

    const cacheKey = `weather_${cityName.toLowerCase()}`;
    const cached = this.weatherCache.get(cacheKey);

    // Return cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Check if we've exceeded API call limit
    if (this.apiCallsToday >= this.MAX_API_CALLS_PER_DAY) {
      console.warn('Weather API daily limit reached, using cached data if available');
      return cached?.data || null;
    }

    try {
      this.apiCallsToday++;
      const weather = await this.weatherAPI.getCityWeather(cityName);
      this.weatherCache.set(cacheKey, { data: weather, timestamp: Date.now() });
      return weather;
    } catch (error) {
      console.error(`Failed to fetch weather for ${cityName}:`, error);
      // Return cached data even if expired, rather than null
      return cached?.data || null;
    }
  }

  private static async createCityObject(cityConfig: any, loadWeather = false): Promise<City | null> {
    if (!cityConfig.name) {
      console.error('Invalid city config:', cityConfig);
      return null;
    }

    const cityKey = cityConfig.name.toLowerCase();
    const rawCityData = (citiesData as RawCitiesData)[cityKey];
    
    if (!rawCityData) {
      console.error(`No data found for city: ${cityConfig.name} (key: ${cityKey})`);
      return null;
    }

    // Always set weather to null by default
    let weather = null;
    
    // Only fetch weather if explicitly requested and we haven't hit API limits
    if (loadWeather) {
      try {
        weather = await this.getWeatherData(cityConfig.name);
      } catch (error) {
        console.error(`Failed to load weather for ${cityConfig.name}:`, error);
        // Weather remains null
      }
    }

    // Enrich the raw data with generated metadata
    return {
      ...rawCityData,
      weather,
      metadata: this.generateMetadata(rawCityData)
    };
  }

  private static generateMetadata(cityData: CityData) {
    const cityName = cityData.name;
    const countryName = cityData.country;
    
    return {
      title: `Living in ${cityName}, ${countryName} - Digital Nomad Guide`,
      description: cityData.description || `Explore ${cityName}, ${countryName}'s vibrant city life, cost of living, and quality of life metrics.`,
      keywords: [
        cityName.toLowerCase(),
        countryName.toLowerCase(),
        'digital nomad',
        'expat guide',
        'cost of living',
        'quality of life',
        `${cityName.toLowerCase()} weather`,
        `living in ${countryName.toLowerCase()}`
      ]
    };
  }

  static async getCities(page = 1, loadWeather = false): Promise<{ cities: City[]; total: number }> {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const citiesToLoad = SUPPORTED_CITIES.slice(start, end);

      const cities = await Promise.all(
        citiesToLoad.map(config => this.createCityObject(config, loadWeather))
      );

      const validCities = cities.filter((city): city is City => city !== null);
      console.log(`Loaded ${validCities.length} cities for page ${page}`);

      return {
        cities: validCities,
        total: SUPPORTED_CITIES.length
      };
    } catch (error) {
      console.error('Error fetching cities:', error);
      return { cities: [], total: 0 };
    }
  }

  static async getCityBySlug(slug: string): Promise<City | null> {
    try {
      const cityConfig = getConfigCity(slug);
      if (!cityConfig) {
        console.error(`No config found for slug: ${slug}`);
        return null;
      }

      // Always load weather for individual city pages, but handle failures gracefully
      return this.createCityObject(cityConfig, true);
    } catch (error) {
      console.error('Error fetching city by slug:', error);
      return null;
    }
  }

  static generateStaticPaths() {
    try {
      return SUPPORTED_CITIES.map(city => ({
        params: {
          slug: this.generateSlug(city.name, city.country)
        }
      }));
    } catch (error) {
      console.error('Error generating static paths:', error);
      return [];
    }
  }
} 