import axios from 'axios';
import { config } from '../../config/env';

export class WeatherAPI {
  private readonly API_KEY = config.openWeatherKey;
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  // ... rest of the class implementation
} 