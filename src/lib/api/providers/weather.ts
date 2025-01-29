import axios from 'axios';
import { WeatherData } from '@/types/city';

export class WeatherAPI {
  private apiKey = process.env.OPENWEATHER_API_KEY;
  private baseURL = 'https://api.openweathermap.org/data/2.5';
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
        `${this.baseURL}/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${this.apiKey}`,
        { timeout: 5000 }
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