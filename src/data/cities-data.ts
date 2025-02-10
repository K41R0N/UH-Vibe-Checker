import { CityData } from '../types/city';

export const citiesData: Record<string, CityData> = {
  "tirana": {
    "id": "tirana",
    "name": "Tirana",
    "country": "Albania",
    "slug": "tirana",
    "description": "Explore Tirana, a unique destination in Albania.",
    "costOfLiving": {
      "housing": 1000,
      "food": 400,
      "transportation": 100,
      "utilities": 150
    },
    "qualityOfLife": {
      "safety": 7,
      "healthcare": 7,
      "climate": "Moderate"
    }
  },
  "barcelona": {
    "id": "barcelona",
    "name": "Barcelona",
    "country": "Spain",
    "slug": "barcelona",
    "description": "A vibrant Mediterranean city known for its architecture, culture, and beach lifestyle.",
    "costOfLiving": {
      "housing": 1200,
      "food": 500,
      "transportation": 150,
      "utilities": 200
    },
    "qualityOfLife": {
      "safety": 8,
      "healthcare": 8.5,
      "climate": "Excellent"
    }
  },
  "berlin": {
    "id": "berlin",
    "name": "Berlin",
    "country": "Germany",
    "slug": "berlin",
    "description": "A dynamic metropolis at the forefront of arts, technology, and alternative culture.",
    "costOfLiving": {
      "housing": 1400,
      "food": 450,
      "transportation": 120,
      "utilities": 180
    },
    "qualityOfLife": {
      "safety": 8.5,
      "healthcare": 9,
      "climate": "Good"
    }
  },
  "lisbon": {
    "id": "lisbon",
    "name": "Lisbon",
    "country": "Portugal",
    "slug": "lisbon",
    "description": "A historic coastal capital combining traditional charm with modern innovation.",
    "costOfLiving": {
      "housing": 1100,
      "food": 400,
      "transportation": 100,
      "utilities": 150
    },
    "qualityOfLife": {
      "safety": 8,
      "healthcare": 8,
      "climate": "Excellent"
    }
  }
}; 