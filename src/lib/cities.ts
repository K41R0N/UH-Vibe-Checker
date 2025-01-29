import { City } from '../types/city';

// PLACEHOLDER: Mock data for development - Replace with database fetch
const MOCK_CITIES: City[] = [
  {
    id: '1', // PLACEHOLDER: Will be replaced with database-generated ID
    name: 'Barcelona',
    country: 'Spain',
    slug: 'barcelona',
    costOfLiving: {
      // PLACEHOLDER: Sample costs - Replace with real data from API/Database
      housing: 1200,
      food: 400,
      transportation: 50,
      utilities: 150
    },
    qualityOfLife: {
      // PLACEHOLDER: Sample scores - Replace with real data from API/Database
      safety: 8.5,
      healthcare: 9.0,
      climate: 'Mediterranean'
    },
    metadata: {
      // PLACEHOLDER: Sample SEO data - Replace with dynamic generation
      title: 'Living in Barcelona - City Guide',
      description: 'Complete guide to living in Barcelona, Spain',
      keywords: ['barcelona', 'spain', 'cost of living', 'expat']
    }
  },
  // PLACEHOLDER: Additional test city
  {
    id: '2',
    name: 'Lisbon',
    slug: 'lisbon',
    country: 'Portugal',
    costOfLiving: {
      housing: 1000,
      food: 350,
      transportation: 40,
      utilities: 120
    },
    qualityOfLife: {
      safety: 9.0,
      healthcare: 8.5,
      climate: 'Mediterranean'
    },
    metadata: {
      title: 'Living in Lisbon - Digital Nomad Guide',
      description: 'Everything you need to know about living in Lisbon as an expat or digital nomad.',
      keywords: ['lisbon', 'digital nomad', 'expat', 'portugal']
    }
  }
];

// PLACEHOLDER: Replace with database queries
export const getCities = async (): Promise<City[]> => {
  return MOCK_CITIES;
};

export const getCityBySlug = async (slug: string): Promise<City | null> => {
  return MOCK_CITIES.find(city => city.slug === slug) || null;
};

export const generateStaticPaths = async () => {
  return MOCK_CITIES.map(city => ({
    params: { slug: city.slug }
  }));
}; 