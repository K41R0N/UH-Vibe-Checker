import { CostOfLivingAPI } from './sources/costOfLiving';
import { WeatherAPI } from './sources/weather';
import NodeCache from 'node-cache';

export class DataService {
  private cache: NodeCache;
  private costOfLivingAPI: CostOfLivingAPI;
  private weatherAPI: WeatherAPI;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
    this.costOfLivingAPI = new CostOfLivingAPI();
    this.weatherAPI = new WeatherAPI();
  }

  async getCityData(cityName: string) {
    const cacheKey = `city_${cityName.toLowerCase()}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const [costData, weatherData] = await Promise.all([
      this.costOfLivingAPI.getCityData(cityName),
      this.weatherAPI.getWeatherData(cityName)
    ]);

    const cityData = {
      ...costData,
      weather: weatherData
    };

    this.cache.set(cacheKey, cityData);
    return cityData;
  }
} 