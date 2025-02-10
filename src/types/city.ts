// City Data Types
export interface Coordinates {
  latitude: number;
  longitude: number;
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
  condition: string;
  temperature: number;
  humidity: number;
}

export interface GettingAround {
  byPublicTransport?: string;
  byTaxi?: string;
  byBike?: string;
  walking?: string;
}

export interface PracticalInfo {
  visaRequirements?: string;
  language?: string;
  currency?: string;
}

export interface SeasonalInfo {
  bestTimeToVisit?: string;
}

export interface WikiTravelData {
  overview?: string;
  gettingAround?: GettingAround;
  practicalInfo?: PracticalInfo;
  seasonalInfo?: SeasonalInfo;
}

export interface Metadata {
  title: string;
  description: string;
}

// Core City Interface
export interface CityData extends City {
  description: string;
  coordinates: Coordinates;
  costOfLiving: CostOfLivingData;
  qualityOfLife: QualityOfLifeData;
  currentWeather?: WeatherData;
  wikiData?: WikiTravelData;
  metadata: Metadata;
}

// Extended City Interface with Metadata
export interface City extends CityData {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Utility Types
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export interface DataSource {
  name: string;
  url: string;
  lastScraped: Date;
  updateFrequency: number; // in hours
  isActive: boolean;
}

export interface DataUpdateLog {
  cityId: string;
  sourceId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  error?: string;
} 