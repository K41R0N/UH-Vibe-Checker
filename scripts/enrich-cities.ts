/**
 * City Data Enrichment Script
 *
 * This script reads cities.json and enriches it with data from external providers.
 * It's designed to be run manually or as a cron job.
 *
 * Usage:
 *   npm run enrich          # Enrich all cities
 *   npm run enrich -- --limit 10  # Enrich first 10 cities (for testing)
 *   npm run enrich -- --city "London"  # Enrich specific city
 */

import fs from 'fs/promises';
import path from 'path';
import { DataEnricher } from '../src/lib/enrichment/DataEnricher';
import { TeleportProvider } from '../src/lib/providers/teleport/TeleportProvider';
import type { CityData } from '../src/types/city';

interface RawCityData {
  id: string;
  name: string;
  country: string;
  description?: string;
  [key: string]: any;
}

interface EnrichmentConfig {
  limit?: number;
  cityName?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

class CityEnricher {
  private enricher: DataEnricher<RawCityData, CityData>;
  private dataPath: string;

  constructor() {
    this.enricher = new DataEnricher<RawCityData, CityData>({
      conflictResolution: 'priority',
      continueOnError: true,
      maxConcurrency: 3,
      parallel: false // Sequential to respect API rate limits
    });

    this.dataPath = path.join(__dirname, '../src/data/cities.json');
  }

  /**
   * Initialize enricher with providers
   */
  async initialize() {
    console.log('🚀 Initializing City Data Enricher\n');

    // Register providers
    const teleportProvider = new TeleportProvider();
    this.enricher.registerProvider(teleportProvider);

    // TODO: Add more providers here as they're implemented
    // this.enricher.registerProvider(new WikivoyageProvider());
    // this.enricher.registerProvider(new NumbeoProvider());

    await this.enricher.initialize();
    console.log('✅ All providers initialized\n');
  }

  /**
   * Load cities data
   */
  async loadCities(): Promise<Record<string, RawCityData>> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Failed to load cities.json:', error);
      throw error;
    }
  }

  /**
   * Save enriched cities data
   */
  async saveCities(cities: Record<string, any>): Promise<void> {
    try {
      const json = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.dataPath, json, 'utf-8');
      console.log(`\n✅ Saved enriched data to ${this.dataPath}`);
    } catch (error) {
      console.error('❌ Failed to save cities.json:', error);
      throw error;
    }
  }

  /**
   * Enrich all cities
   */
  async enrichCities(config: EnrichmentConfig = {}) {
    const {
      limit,
      cityName,
      dryRun = false,
      verbose = false
    } = config;

    // Load existing data
    const cities = await this.loadCities();
    const cityEntries = Object.entries(cities);

    // Filter cities if needed
    let citiesToEnrich = cityEntries;
    if (cityName) {
      citiesToEnrich = cityEntries.filter(([_, city]) =>
        city.name.toLowerCase().includes(cityName.toLowerCase())
      );
      if (citiesToEnrich.length === 0) {
        console.log(`❌ No cities found matching "${cityName}"`);
        return;
      }
    }
    if (limit) {
      citiesToEnrich = citiesToEnrich.slice(0, limit);
    }

    console.log(`📊 Enriching ${citiesToEnrich.length} cities...\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < citiesToEnrich.length; i++) {
      const [id, city] = citiesToEnrich[i];
      const progress = `[${i + 1}/${citiesToEnrich.length}]`;

      console.log(`${progress} Enriching ${city.name}, ${city.country}...`);

      try {
        const { data, summary } = await this.enricher.enrich(city);

        if (summary.successfulProviders > 0) {
          if (verbose) {
            console.log(`  ✓ Fields populated: ${summary.fieldsPopulated.join(', ')}`);
            console.log(`  ✓ Duration: ${summary.duration}ms`);
          }

          if (!dryRun) {
            cities[id] = data;
          }

          successCount++;
        } else {
          if (verbose) {
            console.log(`  ⚠ No data enriched`);
            summary.errors.forEach(err =>
              console.log(`    - ${err.provider}: ${err.error}`)
            );
          }
          skippedCount++;
        }

        // Rate limiting between requests
        if (i < citiesToEnrich.length - 1) {
          await this.delay(500); // 500ms between cities
        }

      } catch (error) {
        console.error(`  ❌ Error:`, error);
        errorCount++;
      }
    }

    // Save results if not dry run
    if (!dryRun && successCount > 0) {
      await this.saveCities(cities);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 Enrichment Summary');
    console.log('='.repeat(60));
    console.log(`Total cities processed: ${citiesToEnrich.length}`);
    console.log(`✅ Successfully enriched: ${successCount}`);
    console.log(`⚠️  Skipped (no data): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    if (dryRun) {
      console.log('\n⚠️  DRY RUN - No changes were saved');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): EnrichmentConfig {
  const args = process.argv.slice(2);
  const config: EnrichmentConfig = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--limit' && args[i + 1]) {
      config.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--city' && args[i + 1]) {
      config.cityName = args[i + 1];
      i++;
    } else if (arg === '--dry-run') {
      config.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      config.verbose = true;
    }
  }

  return config;
}

/**
 * Main execution
 */
async function main() {
  const config = parseArgs();
  const enricher = new CityEnricher();

  try {
    await enricher.initialize();
    await enricher.enrichCities(config);
    console.log('\n✨ Done!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { CityEnricher };
