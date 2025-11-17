import { IDataProvider, EnrichmentResult } from '../providers/base/DataProvider';

/**
 * Data Enrichment Orchestrator
 *
 * Coordinates multiple data providers to enrich base data objects.
 * This is topic-agnostic and can work with any data type.
 *
 * Features:
 * - Manages multiple providers
 * - Handles provider priority and conflict resolution
 * - Batch processing support
 * - Error handling and fallbacks
 */

export interface EnricherConfig {
  /**
   * How to handle conflicts when multiple providers return the same field
   * - 'priority': Use data from highest priority provider
   * - 'merge': Attempt to merge data intelligently
   * - 'first': Use first successful provider's data
   */
  conflictResolution: 'priority' | 'merge' | 'first';

  /**
   * Whether to continue enriching if a provider fails
   */
  continueOnError: boolean;

  /**
   * Maximum concurrent provider calls
   */
  maxConcurrency: number;

  /**
   * Whether to run providers in parallel or sequentially
   */
  parallel: boolean;
}

export interface EnrichmentSummary {
  totalProviders: number;
  successfulProviders: number;
  failedProviders: number;
  fieldsPopulated: string[];
  errors: Array<{
    provider: string;
    error: string;
  }>;
  duration: number; // milliseconds
}

export class DataEnricher<TInput = any, TOutput = any> {
  private providers: IDataProvider<TInput, TOutput>[] = [];
  private initialized = false;

  constructor(private config: EnricherConfig = DataEnricher.defaultConfig()) {}

  static defaultConfig(): EnricherConfig {
    return {
      conflictResolution: 'priority',
      continueOnError: true,
      maxConcurrency: 3,
      parallel: true
    };
  }

  /**
   * Register a data provider
   */
  registerProvider(provider: IDataProvider<TInput, TOutput>): void {
    if (!provider.config.enabled) {
      console.log(`[DataEnricher] Skipping disabled provider: ${provider.metadata.name}`);
      return;
    }

    this.providers.push(provider);

    // Sort by priority (lower number = higher priority)
    this.providers.sort((a, b) => a.config.priority - b.config.priority);

    console.log(`[DataEnricher] Registered provider: ${provider.metadata.name} (priority: ${provider.config.priority})`);
  }

  /**
   * Initialize all providers
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log(`[DataEnricher] Initializing ${this.providers.length} providers...`);

    const initPromises = this.providers.map(async (provider) => {
      try {
        await provider.initialize();
        const healthy = await provider.healthCheck();
        if (!healthy) {
          console.warn(`[DataEnricher] Provider ${provider.metadata.name} failed health check`);
        }
      } catch (error) {
        console.error(`[DataEnricher] Failed to initialize ${provider.metadata.name}:`, error);
      }
    });

    await Promise.all(initPromises);
    this.initialized = true;
    console.log('[DataEnricher] All providers initialized');
  }

  /**
   * Enrich a single data item
   */
  async enrich(
    baseData: TInput
  ): Promise<{ data: TOutput; summary: EnrichmentSummary }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const startTime = Date.now();
    const errors: Array<{ provider: string; error: string }> = [];
    const allFieldsPopulated = new Set<string>();

    let enrichedData: any = { ...baseData };
    let successfulProviders = 0;

    // Filter providers that can enrich this data
    const capableProviders = this.providers.filter(p => p.canEnrich(baseData));

    if (capableProviders.length === 0) {
      console.warn('[DataEnricher] No capable providers found for this data');
      return {
        data: enrichedData as TOutput,
        summary: {
          totalProviders: this.providers.length,
          successfulProviders: 0,
          failedProviders: 0,
          fieldsPopulated: [],
          errors: [],
          duration: Date.now() - startTime
        }
      };
    }

    console.log(`[DataEnricher] Enriching with ${capableProviders.length} providers (max concurrency: ${this.config.maxConcurrency})`);

    // Enrich with each provider
    if (this.config.parallel) {
      // Parallel execution with bounded concurrency
      const results = await this.executeWithConcurrencyLimit(
        capableProviders.map(provider => () => this.enrichWithProvider(provider, baseData)),
        this.config.maxConcurrency
      );

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const provider = capableProviders[i];

        if (result.success && result.data) {
          enrichedData = this.mergeData(enrichedData, result.data);
          result.metadata.fieldsPopulated.forEach(f => allFieldsPopulated.add(f));
          successfulProviders++;
        } else if (result.error) {
          errors.push({ provider: provider.metadata.name, error: result.error });
        }
      }
    } else {
      // Sequential execution
      for (const provider of capableProviders) {
        const result = await this.enrichWithProvider(provider, baseData);

        if (result.success && result.data) {
          enrichedData = this.mergeData(enrichedData, result.data);
          result.metadata.fieldsPopulated.forEach(f => allFieldsPopulated.add(f));
          successfulProviders++;
        } else if (result.error) {
          errors.push({ provider: provider.metadata.name, error: result.error });
          if (!this.config.continueOnError) break;
        }
      }
    }

    const summary: EnrichmentSummary = {
      totalProviders: capableProviders.length,
      successfulProviders,
      failedProviders: capableProviders.length - successfulProviders,
      fieldsPopulated: Array.from(allFieldsPopulated),
      errors,
      duration: Date.now() - startTime
    };

    return { data: enrichedData as TOutput, summary };
  }

  /**
   * Enrich multiple items in batch
   */
  async enrichBatch(
    dataArray: TInput[],
    onProgress?: (current: number, total: number) => void
  ): Promise<Array<{ data: TOutput; summary: EnrichmentSummary }>> {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log(`[DataEnricher] Batch enriching ${dataArray.length} items`);

    const results = [];
    for (let i = 0; i < dataArray.length; i++) {
      const result = await this.enrich(dataArray[i]);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, dataArray.length);
      }

      // Small delay to avoid overwhelming APIs
      if (i < dataArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Execute tasks with bounded concurrency
   */
  private async executeWithConcurrencyLimit<T>(
    tasks: Array<() => Promise<T>>,
    limit: number
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      // Start the task
      const promise = task().then(result => {
        results.push(result);
      });

      // Add to executing queue
      const executing_promise = promise.then(() => {
        executing.splice(executing.indexOf(executing_promise), 1);
      });
      executing.push(executing_promise);

      // Wait if we've reached the concurrency limit
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }

    // Wait for all remaining tasks to complete
    await Promise.all(executing);

    return results;
  }

  /**
   * Enrich with a single provider
   */
  private async enrichWithProvider(
    provider: IDataProvider<TInput, TOutput>,
    data: TInput
  ): Promise<EnrichmentResult<TOutput>> {
    try {
      console.log(`[DataEnricher] Enriching with ${provider.metadata.name}...`);
      return await provider.enrich(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[DataEnricher] Provider ${provider.metadata.name} threw error:`, message);
      return {
        success: false,
        error: message,
        metadata: {
          provider: provider.metadata.name,
          timestamp: new Date().toISOString(),
          fieldsPopulated: []
        }
      };
    }
  }

  /**
   * Merge enriched data based on conflict resolution strategy
   */
  private mergeData(base: any, enrichment: Partial<TOutput>): any {
    switch (this.config.conflictResolution) {
      case 'priority':
        // Only add fields that don't exist in base
        return {
          ...base,
          ...Object.fromEntries(
            Object.entries(enrichment).filter(([key]) => base[key] === undefined)
          )
        };

      case 'first':
        // Keep whatever's in base, only add new fields
        return {
          ...base,
          ...Object.fromEntries(
            Object.entries(enrichment).filter(([key]) => !(key in base))
          )
        };

      case 'merge':
      default:
        // Deep merge (simple implementation - can be enhanced)
        return this.deepMerge(base, enrichment);
    }
  }

  /**
   * Simple deep merge
   */
  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(output[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  /**
   * Get registered providers
   */
  getProviders(): ReadonlyArray<IDataProvider<TInput, TOutput>> {
    return this.providers;
  }

  /**
   * Get provider by name
   */
  getProvider(name: string): IDataProvider<TInput, TOutput> | undefined {
    return this.providers.find(p => p.metadata.name === name);
  }
}
