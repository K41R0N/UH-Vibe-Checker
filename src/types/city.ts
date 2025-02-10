// City Data Types
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

export interface WikiTravelData {
  overview: string;
  gettingAround: {
    byPublicTransport: string;
    byTaxi: string;
    byBike: string;
    walking: string;
  };
  neighborhoods: Array<{
    name: string;
    description: string;
    safetyLevel: string;
    bestFor: string[];
  }>;
  practicalInfo: {
    visaRequirements: string;
    language: string;
    currency: string;
    emergencyNumbers: {
      police: string;
      ambulance: string;
      fire: string;
    };
    internetConnectivity: {
      averageSpeed: string;
      publicWifi: string;
      coworkingSpaces: string[];
    };
  };
  culturalNotes: {
    customs: string[];
    etiquette: string[];
    localLaws: string[];
  };
  seasonalInfo: {
    bestTimeToVisit: string;
    events: Array<{
      name: string;
      date: string;
      description: string;
    }>;
    weather: {
      summer: string;
      winter: string;
      spring: string;
      fall: string;
    };
  };
}

// Core City Interface
export interface CityData {
  id: string;
  name: string;
  country: string;
  slug: string;
  description: string;
  costOfLiving?: CostOfLivingData;
  qualityOfLife?: QualityOfLifeData;
  weather?: WeatherData;
  wikiData?: WikiTravelData;
  lastUpdated?: {
    weather: Date;
    wikiTravel: Date;
    costOfLiving: Date;
    news: Date;
  };
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