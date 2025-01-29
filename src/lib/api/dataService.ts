import { CityData } from '@/types/city';
import { TeleportAPI } from './providers/teleport';
import { WeatherAPI } from './providers/weather';
import { OpenAIAPI } from './providers/openai';
import NodeCache from 'node-cache';

export class DataService {
  private cache: NodeCache;
  private teleportAPI: TeleportAPI;
  private weatherAPI: WeatherAPI;
  private openAIAPI: OpenAIAPI;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 86400 }); // 24 hour cache
    this.teleportAPI = new TeleportAPI();
    this.weatherAPI = new WeatherAPI();
    this.openAIAPI = new OpenAIAPI();
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

      const description = await this.openAIAPI.generateCityDescription(
        cityName,
        teleportData.country
      );

      const cityData: CityData = {
        id: teleportData.id || cityName.toLowerCase(),
        name: cityName,
        country: teleportData.country,
        slug: cityName.toLowerCase().replace(/\s+/g, '-'),
        costOfLiving: teleportData.costOfLiving,
        qualityOfLife: teleportData.qualityOfLife,
        weather: weatherData,
        description
      };

      this.cache.set(cacheKey, cityData);
      return cityData;
    } catch (error) {
      console.error(`Error fetching data for ${cityName}:`, error);
      throw error;
    }
  }
} 