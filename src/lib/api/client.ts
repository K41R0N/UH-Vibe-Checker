import axios from 'axios';
import { config } from '../config/env';

// Create base API clients with default configs
export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: config.openWeatherKey,
    units: 'metric'
  }
});

export const teleportClient = axios.create({
  baseURL: 'https://api.teleport.org/api/urban_areas'
});

// Error handling wrapper
export async function fetchWithErrorHandling<T>(
  fetcher: () => Promise<T>,
  errorContext: string
): Promise<T | null> {
  try {
    return await fetcher();
  } catch (error) {
    console.error(`Error in ${errorContext}:`, error);
    return null;
  }
} 