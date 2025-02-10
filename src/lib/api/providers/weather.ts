import type { Coordinates, WeatherData } from '@/types/city';

export class WeatherAPI {
  private static readonly API_KEY = process.env.WEATHER_API_KEY;
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  static async getCurrentWeather(coordinates: Coordinates): Promise<WeatherData> {
    if (!this.API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API responded with status: ${response.status}`);
      }

      const data = await response.json();

      return {
        condition: data.weather[0].main,
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
} 