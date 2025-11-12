export function validateEnv() {
  // In development, we allow missing env vars as we use fallback data
  if (process.env.NODE_ENV === 'development') {
    if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      console.warn('⚠️ NEXT_PUBLIC_OPENWEATHER_API_KEY not set. Using fallback weather data.');
    }
    return true;
  }

  // In production, log warnings but don't fail - weather will gracefully degrade
  const requiredEnvVars = [
    'NEXT_PUBLIC_OPENWEATHER_API_KEY'
  ];

  let hasAllVars = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`⚠️ Missing environment variable: ${envVar}. Some features may be limited.`);
      hasAllVars = false;
    }
  }

  return hasAllVars;
}

export const config = {
  openWeatherKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '120')
  }
} as const; 