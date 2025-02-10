export const API_CONFIG = {
  weather: {
    baseURL: 'https://api.openweathermap.org/data/2.5',
    timeout: 5000,
    defaultParams: {
      units: 'metric'
    }
  }
} as const;

export const getApiKey = (service: 'weather'): string | undefined => {
  const keys = {
    weather: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  };
  return keys[service];
}; 