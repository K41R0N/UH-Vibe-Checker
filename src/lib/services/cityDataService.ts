import { CityConfig } from '@/data/cities-config';
import { RateLimiter } from '@/lib/utils/rateLimiter';
import NodeCache from 'node-cache';
import fs from 'fs/promises';
import path from 'path';

interface CacheConfig {
  stdTTL: number;        // Cache time in seconds
  checkperiod: number;   // Check period in seconds
}

export class CityDataService {
  private cache: NodeCache;
  private rateLimiter: RateLimiter;
  private readonly CACHE_FILE_PATH: string;
  private static readonly MAX_API_CALLS = 950; // Keep some buffer below 1000
  
  constructor(cacheConfig: CacheConfig) {
    this.cache = new NodeCache(cacheConfig);
    this.rateLimiter = new RateLimiter(CityDataService.MAX_API_CALLS);
    this.CACHE_FILE_PATH = path.join(process.cwd(), 'cache', 'cities');
  }

  async getCityData(cityConfig: CityConfig) {
    const cacheKey = `city_${cityConfig.slug}`;
    
    // Try memory cache first
    let cityData = this.cache.get(cacheKey);
    if (cityData) {
      return cityData;
    }

    // Try file cache next
    try {
      cityData = await this.loadFromFileCache(cityConfig.slug);
      if (cityData) {
        this.cache.set(cacheKey, cityData);
        return cityData;
      }
    } catch (error) {
      console.error(`Error loading cache for ${cityConfig.slug}:`, error);
    }

    // Fetch fresh data if cache miss and we haven't hit rate limits
    if (this.rateLimiter.canMakeRequest()) {
      try {
        cityData = await this.fetchCityData(cityConfig);
        this.rateLimiter.incrementRequests();
        
        // Update both caches
        if (cityData) {
          this.cache.set(cacheKey, cityData);
          await this.saveToFileCache(cityConfig.slug, cityData);
        }
        
        return cityData;
      } catch (error) {
        console.error(`Error fetching data for ${cityConfig.slug}:`, error);
      }
    } else {
      console.warn(`Rate limit reached, using cached data for ${cityConfig.slug}`);
    }

    // Return null if all attempts fail
    return null;
  }

  private async loadFromFileCache(slug: string) {
    try {
      const filePath = path.join(this.CACHE_FILE_PATH, `${slug}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const cached = JSON.parse(data);
      
      // Check if cache is still valid
      if (cached.timestamp > Date.now() - (24 * 60 * 60 * 1000)) { // 24 hours
        return cached.data;
      }
    } catch (error) {
      return null;
    }
  }

  private async saveToFileCache(slug: string, data: any) {
    try {
      const filePath = path.join(this.CACHE_FILE_PATH, `${slug}.json`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      await fs.writeFile(filePath, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (error) {
      console.error(`Error saving cache for ${slug}:`, error);
    }
  }

  private async fetchCityData(cityConfig: CityConfig) {
    // Implementation of your API calls here
    // This is a placeholder that will be implemented later
    return null;
  }

  // Method to refresh all city data (can be run daily via cron)
  async refreshAllCities() {
    // Implementation for refreshing all city data
    // This is a placeholder that will be implemented later
  }
} 