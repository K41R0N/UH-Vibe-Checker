import axios from 'axios';
import { config } from '../../config/env';

export class WeatherAPI {
  private readonly API_KEY = config.openWeatherKey;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  async getWeatherData(lat: number, lon: number) {
    try {
      const response = await axios.get(`${this.BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.API_KEY,
          units: 'metric'
        }
      });

      if (!response.data) {
        return this.getFallbackData();
      }

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getFallbackData();
    }
  }

  private formatWeatherData(data: any) {
    return {
      temperature: Math.round(data.main?.temp ?? 20),
      description: data.weather?.[0]?.description ?? 'Clear sky',
      icon: data.weather?.[0]?.icon ?? '01d',
      humidity: data.main?.humidity ?? 50,
      windSpeed: Math.round(data.wind?.speed ?? 5)
    };
  }

  private getFallbackData() {
    return {
      temperature: 20,
      description: 'Clear sky',
      icon: '01d',
      humidity: 50,
      windSpeed: 5
    };
  }
} 