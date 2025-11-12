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
    // Always use fallback data in development or if no API key
    if (process.env.NODE_ENV === 'development' || !this.apiKey) {
      const message = process.env.NODE_ENV === 'development'
        ? 'Development mode - weather data simulated'
        : 'Weather data temporarily unavailable';

      if (!this.apiKey && process.env.NODE_ENV !== 'development') {
        console.warn('⚠️ OpenWeather API key not configured. Using fallback data.');
      }

      return {
        ...this.fallbackData,
        condition: message
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