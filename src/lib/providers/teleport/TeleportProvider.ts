import axios, { AxiosInstance } from 'axios';
import {
  BaseDataProvider,
  ProviderConfig,
  ProviderMetadata,
  EnrichmentResult
} from '../base/DataProvider';
import {
  TeleportInput,
  TeleportEnrichedData,
  TeleportUrbanArea,
  TeleportScores,
  TeleportCostOfLiving
} from './types';

/**
 * Teleport API Provider
 *
 * Provides cost of living and quality of life data for ~266 major cities worldwide.
 * Free API, no key required.
 *
 * API Docs: https://developers.teleport.org/api/reference/
 */
export class TeleportProvider extends BaseDataProvider<TeleportInput, TeleportEnrichedData> {
  readonly metadata: ProviderMetadata = {
    name: 'Teleport',
    version: '1.0.0',
    description: 'Cost of living and quality of life data from Teleport',
    supportedFields: ['costOfLiving', 'qualityOfLife', 'teleportData'],
    requiredFields: ['name'] // Only need city name
  };

  readonly config: ProviderConfig = {
    enabled: true,
    priority: 1, // High priority - good quality data
    baseUrl: 'https://api.teleport.org/api',
    rateLimit: {
      requestsPerSecond: 2, // Be respectful
      requestsPerDay: 10000
    },
    timeout: 10000 // 10 seconds
  };

  private client: AxiosInstance;
  private cache = new Map<string, { data: TeleportEnrichedData; timestamp: number }>();
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    super();
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': 'Vibe-Checker/1.0',
        'Accept': 'application/json'
      }
    });
  }

  protected async onInitialize(): Promise<void> {
    // Test connection
    try {
      await this.client.get('/urban_areas/');
      console.log('[Teleport] API connection successful');
    } catch (error) {
      console.warn('[Teleport] Failed to connect to API:', error);
      throw error;
    }
  }

  protected async onHealthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/urban_areas/', { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  canEnrich(data: TeleportInput): boolean {
    // Must have a city name
    if (!data.name) return false;

    // Check cache
    const cacheKey = this.getCacheKey(data);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return true; // Have cached data
    }

    return true; // Will attempt to fetch
  }

  async enrich(data: TeleportInput): Promise<EnrichmentResult<TeleportEnrichedData>> {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(data);
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`[Teleport] Using cached data for ${data.name}`);
        return this.createSuccessResult(
          cached.data,
          Object.keys(cached.data),
          1.0
        );
      }

      await this.respectRateLimit();

      // Step 1: Find the urban area
      const urbanArea = await this.findUrbanArea(data.name, data.country);
      if (!urbanArea) {
        return this.createErrorResult(`City not found in Teleport: ${data.name}`);
      }

      // Step 2: Fetch scores (quality of life)
      const scores = await this.fetchScores(urbanArea);

      // Step 3: Fetch cost of living
      const costOfLiving = await this.fetchCostOfLiving(urbanArea);

      // Step 4: Transform to our format
      const enrichedData = this.transformData(urbanArea, scores, costOfLiving);

      // Cache the result
      this.cache.set(cacheKey, {
        data: enrichedData,
        timestamp: Date.now()
      });

      const fieldsPopulated = Object.keys(enrichedData).filter(
        key => enrichedData[key as keyof TeleportEnrichedData] !== undefined
      );

      return this.createSuccessResult(enrichedData, fieldsPopulated, 0.9);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Teleport] Error enriching ${data.name}:`, message);
      return this.createErrorResult(message);
    }
  }

  /**
   * Find urban area by city name
   */
  private async findUrbanArea(
    cityName: string,
    country?: string
  ): Promise<TeleportUrbanArea | null> {
    try {
      // Search by name
      const searchName = `${cityName}${country ? `, ${country}` : ''}`;
      const response = await this.client.get('/urban_areas/', {
        params: { search: searchName }
      });

      const areas = response.data._links['ua:item'] || [];
      if (areas.length === 0) {
        // Try without country
        const fallbackResponse = await this.client.get('/urban_areas/', {
          params: { search: cityName }
        });
        const fallbackAreas = fallbackResponse.data._links['ua:item'] || [];
        if (fallbackAreas.length === 0) return null;

        // Get first match
        const areaResponse = await this.client.get(fallbackAreas[0].href);
        return areaResponse.data;
      }

      // Get detailed info for first match
      const areaResponse = await this.client.get(areas[0].href);
      return areaResponse.data;

    } catch (error) {
      console.error(`[Teleport] Error finding urban area:`, error);
      return null;
    }
  }

  /**
   * Fetch quality of life scores
   */
  private async fetchScores(urbanArea: TeleportUrbanArea): Promise<TeleportScores | null> {
    try {
      const scoresUrl = urbanArea._links['ua:scores']?.href;
      if (!scoresUrl) return null;

      const response = await this.client.get(scoresUrl);
      return response.data;
    } catch (error) {
      console.warn(`[Teleport] Error fetching scores:`, error);
      return null;
    }
  }

  /**
   * Fetch cost of living data
   */
  private async fetchCostOfLiving(
    urbanArea: TeleportUrbanArea
  ): Promise<TeleportCostOfLiving | null> {
    try {
      const costUrl = urbanArea._links['ua:cost-of-living']?.href;
      if (!costUrl) return null;

      const response = await this.client.get(costUrl);
      return response.data;
    } catch (error) {
      console.warn(`[Teleport] Error fetching cost of living:`, error);
      return null;
    }
  }

  /**
   * Transform Teleport data to our format
   */
  private transformData(
    urbanArea: TeleportUrbanArea,
    scores: TeleportScores | null,
    costData: TeleportCostOfLiving | null
  ): TeleportEnrichedData {
    const result: TeleportEnrichedData = {};

    // Transform quality of life scores
    if (scores) {
      const categoryMap = new Map(
        scores.categories.map(cat => [cat.name, cat.score_out_of_10])
      );

      result.qualityOfLife = {
        safety: categoryMap.get('Safety') || 5,
        healthcare: categoryMap.get('Healthcare') || 5,
        climate: this.getClimateDescription(categoryMap.get('Climate') || 5)
      };

      result.teleportData = {
        overallScore: scores.teleport_city_score,
        categories: Object.fromEntries(categoryMap),
        summary: scores.summary,
        url: urbanArea.teleport_city_url || `https://teleport.org/cities/${urbanArea.slug}/`
      };
    }

    // Transform cost of living
    if (costData && costData.prices) {
      const priceMap = new Map(
        costData.prices.map(p => [p.item_name.toLowerCase(), p.average_price])
      );

      result.costOfLiving = {
        housing: this.estimateHousing(priceMap),
        food: this.estimateFood(priceMap),
        transportation: this.estimateTransportation(priceMap),
        utilities: this.estimateUtilities(priceMap)
      };
    }

    return result;
  }

  /**
   * Helper methods to estimate costs from Teleport data
   */
  private estimateHousing(priceMap: Map<string, number>): number {
    // Look for rent-related items
    const rent1br = priceMap.get('rent, 1br apartment') || priceMap.get('apartment (1 bedroom) in city centre');
    return rent1br ? Math.round(rent1br) : 1000; // Default fallback
  }

  private estimateFood(priceMap: Map<string, number>): number {
    // Average food costs
    const meal = priceMap.get('meal, inexpensive restaurant');
    const groceries = priceMap.get('meal for 2, mid-range restaurant, three-course');
    const avg = meal && groceries ? (meal * 60 + groceries * 10) / 2 : null;
    return avg ? Math.round(avg) : 400; // Default fallback
  }

  private estimateTransportation(priceMap: Map<string, number>): number {
    const monthlyPass = priceMap.get('public transport, monthly pass');
    return monthlyPass ? Math.round(monthlyPass) : 100; // Default fallback
  }

  private estimateUtilities(priceMap: Map<string, number>): number {
    const utilities = priceMap.get('basic utilities (electricity, heating, cooling, water, garbage) for 85m2 apartment');
    return utilities ? Math.round(utilities) : 150; // Default fallback
  }

  private getClimateDescription(score: number): string {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Moderate';
    return 'Challenging';
  }

  private getCacheKey(data: TeleportInput): string {
    return `${data.name.toLowerCase()}-${data.country?.toLowerCase() || 'unknown'}`;
  }
}
