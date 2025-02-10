import axios from 'axios';
import { WeatherData } from '@/types/city';
import { API_CONFIG, getApiKey } from '@/lib/config/api';

export class WeatherAPI {
  private apiKey = getApiKey('weather');
  private config = API_CONFIG.weather;
  private fallbackData: WeatherData = {
    temperature: 20,
    condition: 'Unknown',
    humidity: 50
  };

  async getCityWeather(cityName: string): Promise<WeatherData> {
    if (!this.apiKey) {
      console.warn('OpenWeather API key not found, using fallback data');
      return this.fallbackData;
    }

    try {
      const response = await axios.get(
        `${this.config.baseURL}/weather`,
        {
          params: {
            q: cityName,
            ...this.config.defaultParams,
            appid: this.apiKey
          },
          timeout: this.config.timeout
        }
      );

      return {
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather[0].description,
        humidity: response.data.main.humidity
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        ...this.fallbackData,
        condition: `Weather data unavailable for ${cityName}`
      };
    }
  }
} 