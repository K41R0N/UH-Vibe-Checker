// Define our core data types
export interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  costOfLiving: {
    housing: number;
    food: number;
    transportation: number;
    utilities: number;
  };
  qualityOfLife: {
    safety: number;
    healthcare: number;
    climate: string;
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface CostOfLiving {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
}

export interface QualityOfLife {
  safety: number;
  healthcare: number;
  climate: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
} 