import { CityData } from '@/types/city';
import { TeleportAPI } from './providers/teleport';
import { WeatherAPI } from './providers/weather';
import NodeCache from 'node-cache';

export class DataService {
  private cache: NodeCache;
  private teleportAPI: TeleportAPI;
  private weatherAPI: WeatherAPI;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache
    this.teleportAPI = new TeleportAPI();
    this.weatherAPI = new WeatherAPI();
  }

  async getCityData(cityName: string): Promise<CityData> {
    const cacheKey = `city_${cityName.toLowerCase()}`;
    const cachedData = this.cache.get<CityData>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const [teleportData, weatherData] = await Promise.all([
        this.teleportAPI.getCityData(cityName),
        this.weatherAPI.getCityWeather(cityName)
      ]);

      const cityData: CityData = {
        id: teleportData.id || cityName.toLowerCase(),
        name: cityName,
        country: teleportData.country,
        slug: cityName.toLowerCase().replace(/\s+/g, '-'),
        description: `Explore ${cityName}, ${teleportData.country}'s vibrant city.`,
        costOfLiving: teleportData.costOfLiving,
        qualityOfLife: teleportData.qualityOfLife,
        weather: weatherData
      };

      this.cache.set(cacheKey, cityData);
      return cityData;
    } catch (error) {
      console.error(`Error fetching data for ${cityName}:`, error);
      throw error;
    }
  }
} 