import type {
  City,
  CityData,
  CostOfLivingData,
  QualityOfLifeData,
  WeatherData,
  WikiTravelData
} from '@/types/city';
import citiesData from '@/data/cities.json';
import { SUPPORTED_CITIES } from '@/data/cities-config';
import { WeatherAPI } from '../api/providers/weather';

type RawCitiesData = Record<string, CityData>;

const ITEMS_PER_PAGE = 20;

// Validate data loaded correctly
if (!citiesData || typeof citiesData !== 'object') {
  console.error('[CityService] Failed to load cities.json - data is invalid');
  throw new Error('Cities data failed to load');
}
if (!SUPPORTED_CITIES || !Array.isArray(SUPPORTED_CITIES)) {
  console.error('[CityService] SUPPORTED_CITIES is not an array');
  throw new Error('Cities configuration failed to load');
}
console.log(`[CityService] Initialized with ${Object.keys(citiesData).length} cities in JSON, ${SUPPORTED_CITIES.length} supported cities`);

export class CityService {
  private static weatherAPI = new WeatherAPI();
  private static weatherCache = new Map<string, { data: any; timestamp: number }>();
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private static apiCallsToday = 0;
  private static lastApiCallReset = new Date().setHours(0, 0, 0, 0);
  private static MAX_API_CALLS_PER_DAY = 950; // Setting slightly below 1000 for safety

  // Build-time cache to prevent O(n²) during static site generation
  private static allCitiesCache: City[] | null = null;

  private static generateSlug(name: string, country: string): string {
    if (!name || !country) {
      throw new Error(`Invalid city data: name=${name}, country=${country}`);
    }
    
    // Normalize both name and country, ensuring consistent spacing
    const normalizedName = name.toLowerCase().trim()
      .replace(/\s+/g, '-');     // Replace all spaces with hyphens in city name
    const normalizedCountry = country.toLowerCase().trim()
      .replace(/\s+/g, '-');     // Replace all spaces with hyphens in country name
    
    // Create the combined slug with format: city-name-country
    return `${normalizedName}-${normalizedCountry}`
      .replace(/[^a-z0-9-]/g, '') // Remove any special characters
      .replace(/-+/g, '-')        // Replace multiple consecutive hyphens with a single one
      .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
  }

  private static resetApiCallsIfNewDay() {
    const today = new Date().setHours(0, 0, 0, 0);
    if (today > this.lastApiCallReset) {
      this.apiCallsToday = 0;
      this.lastApiCallReset = today;
    }
  }

  private static async getWeatherData(cityName: string): Promise<WeatherData | null> {
    this.resetApiCallsIfNewDay();

    const cacheKey = `weather_${cityName.toLowerCase()}`;
    const cached = this.weatherCache.get(cacheKey);

    // Return cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Check if we've exceeded API call limit
    if (this.apiCallsToday >= this.MAX_API_CALLS_PER_DAY) {
      console.warn('Weather API daily limit reached, using cached data if available');
      return cached?.data || null;
    }

    try {
      this.apiCallsToday++;
      const weather = await this.weatherAPI.getCityWeather(cityName);
      this.weatherCache.set(cacheKey, { data: weather, timestamp: Date.now() });
      return weather;
    } catch (error) {
      console.error(`Failed to fetch weather for ${cityName}:`, error);
      // Return cached data even if expired, rather than null
      return cached?.data || null;
    }
  }

  private static generateMetadata(cityData: CityData) {
    const cityName = cityData.name;
    const countryName = cityData.country;
    const hasFullData = Boolean(
      cityData.costOfLiving &&
      cityData.qualityOfLife &&
      cityData.wikiData?.overview
    );
    
    return {
      title: `Living in ${cityName}, ${countryName} - Digital Nomad Guide`,
      description: hasFullData
        ? cityData.description
        : `Explore ${cityName}, ${countryName}'s vibrant city life. We're actively gathering detailed information about cost of living, quality of life, and local insights. Check back soon for comprehensive data.`,
      keywords: [
        cityName.toLowerCase(),
        countryName.toLowerCase(),
        'digital nomad',
        'expat guide',
        'cost of living',
        'quality of life',
        `${cityName.toLowerCase()} weather`,
        `living in ${countryName.toLowerCase()}`
      ]
    };
  }

  private static async createCityObject(cityConfig: any, loadWeather = false): Promise<City | null> {
    if (!cityConfig.name) {
      console.error('Invalid city config:', cityConfig);
      return null;
    }

    // Normalize the city key to handle spaces and special characters
    const cityKey = cityConfig.name.toLowerCase().replace(/-/g, ' ');
    const rawCityData = (citiesData as RawCitiesData)[cityKey];
    
    if (!rawCityData) {
      console.error(`No data found for city: ${cityConfig.name} (key: ${cityKey})`);
      return null;
    }

    // Generate the proper slug with city and country
    const slug = this.generateSlug(cityConfig.name, cityConfig.country);

    // Always set weather to null by default
    let weather = null;
    
    // Only fetch weather if explicitly requested and we haven't hit API limits
    if (loadWeather) {
      try {
        weather = await this.getWeatherData(cityConfig.name);
      } catch (error) {
        console.error(`Failed to load weather for ${cityConfig.name}:`, error);
        // Weather remains null
      }
    }

    // Default values with proper types
    const defaultCostOfLiving: CostOfLivingData = {
      housing: 0,
      food: 0,
      transportation: 0,
      utilities: 0
    };

    const defaultQualityOfLife: QualityOfLifeData = {
      safety: 0,
      healthcare: 0,
      climate: 'Data coming soon'
    };

    const defaultWikiData: WikiTravelData = {
      overview: `Information about ${rawCityData.name} is being compiled. Check back soon for detailed insights.`,
      gettingAround: {
        byPublicTransport: 'Information coming soon',
        byTaxi: 'Information coming soon',
        byBike: 'Information coming soon',
        walking: 'Information coming soon'
      },
      neighborhoods: [],
      practicalInfo: {
        visaRequirements: 'Information being updated',
        language: 'Information coming soon',
        currency: 'Information coming soon',
        emergencyNumbers: {
          police: 'Check local emergency numbers',
          ambulance: 'Check local emergency numbers',
          fire: 'Check local emergency numbers'
        },
        internetConnectivity: {
          averageSpeed: 'Data being collected',
          publicWifi: 'Information coming soon',
          coworkingSpaces: []
        }
      },
      culturalNotes: {
        customs: ['Information being compiled'],
        etiquette: ['Information being compiled'],
        localLaws: ['Check local regulations']
      },
      seasonalInfo: {
        bestTimeToVisit: 'Information coming soon',
        events: [],
        weather: {
          summer: 'Data coming soon',
          winter: 'Data coming soon',
          spring: 'Data coming soon',
          fall: 'Data coming soon'
        }
      }
    };

    // Enrich and validate the raw data with proper type checking
    // Note: Using null instead of undefined for JSON serialization in Next.js
    const enrichedData: CityData = {
      ...rawCityData,
      slug, // Use the properly generated slug
      description: rawCityData.description || `Discover ${rawCityData.name}, a unique destination in ${rawCityData.country}.`,
      // Only provide defaults if the data exists but is incomplete
      costOfLiving: rawCityData.costOfLiving
        ? { ...defaultCostOfLiving, ...rawCityData.costOfLiving }
        : undefined,
      qualityOfLife: rawCityData.qualityOfLife
        ? { ...defaultQualityOfLife, ...rawCityData.qualityOfLife }
        : undefined,
      weather: weather ?? null, // null is JSON-serializable, undefined is not
      wikiData: rawCityData.wikiData
        ? { ...defaultWikiData, ...rawCityData.wikiData }
        : undefined
    };

    // Always generate metadata, even if other data is missing
    const metadata = this.generateMetadata(enrichedData);

    // Return the complete city object
    return {
      ...enrichedData,
      metadata
    };
  }

  static async getCities(page = 1, loadWeather = false): Promise<{ cities: City[]; total: number }> {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const citiesToLoad = SUPPORTED_CITIES.slice(start, end);

      const cities = await Promise.all(
        citiesToLoad.map(config => this.createCityObject(config, loadWeather))
      );

      const validCities = cities.filter((city): city is City => city !== null);
      console.log(`Loaded ${validCities.length} cities for page ${page}`);

      return {
        cities: validCities,
        total: SUPPORTED_CITIES.length
      };
    } catch (error) {
      console.error('Error fetching cities:', error);
      return { cities: [], total: 0 };
    }
  }

  /**
   * Get all cities without pagination (useful for sitemap generation and similarity calculations)
   * Uses build-time cache to prevent O(n²) performance during static site generation
   */
  static async getAllCities(loadWeather = false): Promise<City[]> {
    try {
      // Return cached cities if available (and weather not requested)
      if (!loadWeather && this.allCitiesCache !== null) {
        console.log(`[CityService] Returning ${this.allCitiesCache.length} cities from cache`);
        return this.allCitiesCache;
      }

      // Load cities page by page to respect API quotas
      const allCities: City[] = [];
      const totalPages = Math.ceil(SUPPORTED_CITIES.length / ITEMS_PER_PAGE);

      for (let page = 1; page <= totalPages; page++) {
        const { cities } = await this.getCities(page, loadWeather);
        allCities.push(...cities);

        // Stop if we hit weather API quota
        if (loadWeather && this.apiCallsToday >= this.MAX_API_CALLS_PER_DAY) {
          console.warn('[CityService] Weather quota reached while loading all cities');
          break;
        }
      }

      console.log(`[CityService] Loaded all ${allCities.length} cities`);

      // Cache the results if weather wasn't loaded (for build-time reuse)
      if (!loadWeather) {
        this.allCitiesCache = allCities;
      }

      return allCities;
    } catch (error) {
      console.error('[CityService] Error fetching all cities:', error);
      return [];
    }
  }

  static async getCityBySlug(slug: string): Promise<{ city: City | null; error?: string }> {
    try {
      // Find the city in our data using just the name-based slug
      const cityData = Object.values(citiesData).find(city => 
        this.generateSlug(city.name, city.country) === slug
      );

      if (!cityData) {
        return {
          city: null,
          error: `City not found: ${slug}`
        };
      }

      // Get weather data if needed
      let weather: WeatherData | null = null;
      try {
        const weatherData = await this.getWeatherData(cityData.name);
        weather = weatherData ?? null; // Ensure null, not undefined
      } catch (error) {
        console.error(`Failed to fetch weather for ${cityData.name}:`, error);
      }

      // Get current timestamp
      const now = new Date().toISOString();

      // Return the complete city object
      return {
        city: {
          ...cityData,
          weather,
          metadata: {
            title: `Living in ${cityData.name}, ${cityData.country} - Digital Nomad Guide`,
            description: cityData.description || `Explore ${cityData.name}, ${cityData.country}'s vibrant city life.`,
            keywords: [
              cityData.name.toLowerCase(),
              cityData.country.toLowerCase(),
              'digital nomad',
              'expat guide',
              'cost of living',
              'quality of life'
            ]
          },
          lastUpdated: {
            weather: now,
            wikiTravel: now,
            costOfLiving: now,
            news: now
          }
        }
      };
    } catch (error) {
      console.error(`Error fetching city by slug ${slug}:`, error);
      return {
        city: null,
        error: 'An unexpected error occurred while fetching city data.'
      };
    }
  }

  static generateStaticPaths() {
    try {
      return Object.values(citiesData).map(city => ({
        params: {
          slug: this.generateSlug(city.name, city.country)
        }
      }));
    } catch (error) {
      console.error('Error generating static paths:', error);
      return [];
    }
  }
} 