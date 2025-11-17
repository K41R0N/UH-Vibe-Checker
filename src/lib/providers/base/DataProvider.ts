/**
 * Base Data Provider Interface
 *
 * This generic interface can be implemented by any data source provider.
 * It's designed to be topic-agnostic - can work for cities, products, recipes, etc.
 *
 * The key principle: Each provider enriches a base data object with additional fields.
 */

export interface ProviderConfig {
  enabled: boolean;
  priority: number; // Lower number = higher priority when merging data
  apiKey?: string;
  baseUrl?: string;
  rateLimit?: {
    requestsPerSecond: number;
    requestsPerDay: number;
  };
  timeout?: number; // milliseconds
}

export interface ProviderMetadata {
  name: string;
  version: string;
  description: string;
  supportedFields: string[]; // Which fields this provider can populate
  requiredFields: string[];  // Which fields must exist in the base data
}

export interface EnrichmentResult<T = any> {
  success: boolean;
  data?: Partial<T>;
  error?: string;
  metadata: {
    provider: string;
    timestamp: string;
    fieldsPopulated: string[];
    confidence?: number; // 0-1 score for data quality
  };
}

/**
 * Generic Data Provider Interface
 *
 * @template TInput - The type of input data (e.g., { name: string, country: string })
 * @template TOutput - The type of enriched output (e.g., CityData with cost of living)
 */
export interface IDataProvider<TInput = any, TOutput = any> {
  /**
   * Provider metadata
   */
  readonly metadata: ProviderMetadata;

  /**
   * Provider configuration
   */
  readonly config: ProviderConfig;

  /**
   * Initialize the provider (e.g., test API connection, load cache)
   */
  initialize(): Promise<void>;

  /**
   * Check if this provider can enrich the given data
   * @param data - The base data object
   * @returns true if provider can enrich this data
   */
  canEnrich(data: TInput): boolean;

  /**
   * Enrich the data with additional fields
   * @param data - The base data to enrich
   * @returns Partial enriched data or error
   */
  enrich(data: TInput): Promise<EnrichmentResult<TOutput>>;

  /**
   * Batch enrich multiple items (optional, for performance)
   * @param dataArray - Array of base data
   * @returns Array of enrichment results
   */
  enrichBatch?(dataArray: TInput[]): Promise<EnrichmentResult<TOutput>[]>;

  /**
   * Health check - verify the provider is working
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Abstract base class with common functionality
 */
export abstract class BaseDataProvider<TInput = any, TOutput = any>
  implements IDataProvider<TInput, TOutput> {

  abstract readonly metadata: ProviderMetadata;
  abstract readonly config: ProviderConfig;

  protected initialized = false;
  protected lastRequestTime = 0;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log(`[${this.metadata.name}] Initializing provider...`);
    await this.onInitialize();
    this.initialized = true;
    console.log(`[${this.metadata.name}] Provider initialized`);
  }

  /**
   * Override this for provider-specific initialization
   */
  protected async onInitialize(): Promise<void> {
    // Default: no-op
  }

  abstract canEnrich(data: TInput): boolean;
  abstract enrich(data: TInput): Promise<EnrichmentResult<TOutput>>;

  async healthCheck(): Promise<boolean> {
    try {
      console.log(`[${this.metadata.name}] Running health check...`);
      return await this.onHealthCheck();
    } catch (error) {
      console.error(`[${this.metadata.name}] Health check failed:`, error);
      return false;
    }
  }

  /**
   * Override this for provider-specific health checks
   */
  protected abstract onHealthCheck(): Promise<boolean>;

  /**
   * Rate limiting helper
   */
  protected async respectRateLimit(): Promise<void> {
    if (!this.config.rateLimit) return;

    const { requestsPerSecond } = this.config.rateLimit;
    const minInterval = 1000 / requestsPerSecond;
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Create a successful result
   */
  protected createSuccessResult(
    data: Partial<TOutput>,
    fieldsPopulated: string[],
    confidence?: number
  ): EnrichmentResult<TOutput> {
    return {
      success: true,
      data,
      metadata: {
        provider: this.metadata.name,
        timestamp: new Date().toISOString(),
        fieldsPopulated,
        confidence
      }
    };
  }

  /**
   * Create an error result
   */
  protected createErrorResult(error: string): EnrichmentResult<TOutput> {
    return {
      success: false,
      error,
      metadata: {
        provider: this.metadata.name,
        timestamp: new Date().toISOString(),
        fieldsPopulated: []
      }
    };
  }
}
