export interface CityData {
  id: string;
  name: string;
  country: string;
  slug: string;
  description: string;
  costOfLiving?: CostOfLivingData;
  qualityOfLife?: QualityOfLifeData;
  weather?: WeatherData;
} 