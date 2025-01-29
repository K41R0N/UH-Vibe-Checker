export function validateEnv() {
  const requiredEnvVars = [
    'OPENWEATHER_API_KEY',
    'OPENAI_API_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      return false;
    }
  }
  return true;
}

export const config = {
  openWeatherKey: process.env.OPENWEATHER_API_KEY,
  openAIKey: process.env.OPENAI_API_KEY,
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '120')
  }
} as const; 