import { WeatherData } from '@/types/api';
import { weatherClient, fetchWithErrorHandling } from '../client';

export class WeatherService {
  async getWeatherData(cityName: string): Promise<WeatherData | null> {
    return fetchWithErrorHandling(
      async () => {
        const { data } = await weatherClient.get('/weather', {
          params: { q: cityName }
        });

        return {
          temperature: {
            current: Math.round(data.main.temp),
            min: Math.round(data.main.temp_min),
            max: Math.round(data.main.temp_max)
          },
          humidity: data.main.humidity,
          weather: data.weather[0].main,
          description: data.weather[0].description
        };
      },
      'WeatherService.getWeatherData'
    );
  }
} 