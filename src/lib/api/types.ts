export interface ExternalDataSource {
  getCityData: (cityName: string) => Promise<any>;
  getCostOfLiving: (cityName: string) => Promise<any>;
  getWeatherData: (cityName: string) => Promise<any>;
  getCrimeStats: (cityName: string) => Promise<any>;
}

export interface CacheConfig {
  ttl: number;
  checkPeriod: number;
} 