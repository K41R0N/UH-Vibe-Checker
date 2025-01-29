export function validateEnv() {
  const requiredEnvVars = [
    'OPENWEATHER_API_KEY',
    'OPENAI_API_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

export const config = {
  openWeatherKey: process.env.OPENWEATHER_API_KEY!,
  openAIKey: process.env.OPENAI_API_KEY!,
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '120')
  }
} as const; 