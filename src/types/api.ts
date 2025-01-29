export interface WeatherData {
  temperature: {
    current: number;
    min: number;
    max: number;
  };
  humidity: number;
  weather: string;
  description: string;
}

export interface CostOfLivingData {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
}

export interface QualityOfLifeData {
  safety: number;
  healthcare: number;
  climate: string;
}

export interface CityApiData {
  costOfLiving: CostOfLivingData;
  qualityOfLife: QualityOfLifeData;
  weather: WeatherData;
} 