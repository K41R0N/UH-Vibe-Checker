import axios from 'axios';
import { WeatherData } from '@/types/city';
import { API_CONFIG, getApiKey } from '@/lib/config/api';

export class WeatherAPI {
  private apiKey = getApiKey('weather');
  private config = API_CONFIG.weather;
  private fallbackData: WeatherData = {
    temperature: 20,
    condition: 'Weather data loading...',
    humidity: 50
  };

  async getCityWeather(cityName: string): Promise<WeatherData> {
    // Always use fallback data in development
    if (process.env.NODE_ENV === 'development') {
      return {
        ...this.fallbackData,
        condition: 'Development mode - weather data simulated'
      };
    }

    // In production, we expect the API key to be set in Netlify
    if (!this.apiKey) {
      console.warn('OpenWeather API key not found in production environment');
      return {
        ...this.fallbackData,
        condition: 'Weather data temporarily unavailable'
      };
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

      if (!response.data || !response.data.main) {
        throw new Error('Invalid weather data received');
      }

      return {
        temperature: Math.round(response.data.main.temp),
        condition: response.data.weather?.[0]?.description || 'Clear sky',
        humidity: response.data.main.humidity
      };
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
      return {
        ...this.fallbackData,
        condition: 'Weather data temporarily unavailable'
      };
    }
  }
} 