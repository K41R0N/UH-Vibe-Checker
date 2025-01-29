export interface CityInfo {
  name: string;
  country: string;
  countryCode: string;
  description: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  timezone: string;
}

export const cityDatabase: Record<string, CityInfo> = {
  'barcelona': {
    name: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    description: 'A vibrant Mediterranean city known for its architecture, culture, and beach lifestyle.',
    coordinates: {
      lat: 41.3851,
      lon: 2.1734
    },
    timezone: 'Europe/Madrid'
  },
  'lisbon': {
    name: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    description: 'A historic coastal capital combining traditional charm with modern innovation.',
    coordinates: {
      lat: 38.7223,
      lon: -9.1393
    },
    timezone: 'Europe/Lisbon'
  },
  'berlin': {
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    description: 'A dynamic metropolis at the forefront of arts, technology, and alternative culture.',
    coordinates: {
      lat: 52.5200,
      lon: 13.4050
    },
    timezone: 'Europe/Berlin'
  }
};

export const getCityInfo = (citySlug: string): CityInfo | undefined => {
  return cityDatabase[citySlug.toLowerCase()];
};

export const getAllCities = (): CityInfo[] => {
  return Object.values(cityDatabase);
}; 