// Define our core data types
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

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
}

export interface City extends CityData {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
} 