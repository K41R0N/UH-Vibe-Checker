# Data Enrichment Architecture

## Overview

This application uses a **topic-agnostic, provider-based data enrichment architecture** that can be adapted to any programmatic site (cities, products, recipes, etc.) with minimal changes.

The architecture separates data providers from the core business logic, making it easy to add, remove, or swap data sources without touching the application code.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Enrichment Script                         │
│                  (scripts/enrich-cities.ts)                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Enricher                              │
│           (src/lib/enrichment/DataEnricher.ts)               │
│                                                               │
│  • Manages multiple providers                                │
│  • Handles priority & conflict resolution                    │
│  • Batch processing support                                  │
│  • Error handling & fallbacks                                │
└───────────┬───────────────┬───────────────┬─────────────────┘
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   Teleport   │ │  Wikivoyage  │ │    Numbeo    │
    │   Provider   │ │   Provider   │ │   Provider   │
    │              │ │              │ │              │
    │  (Priority   │ │  (Priority   │ │  (Priority   │
    │      1)      │ │      2)      │ │      0)      │
    └──────────────┘ └──────────────┘ └──────────────┘
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  Teleport    │ │  Wikivoyage  │ │   Numbeo     │
    │     API      │ │     API      │ │     API      │
    └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Core Components

### 1. Base Provider Interface (`src/lib/providers/base/DataProvider.ts`)

**Purpose:** Generic contract that all data providers must implement.

**Key Features:**
- Type-safe with generics `<TInput, TOutput>`
- Provider metadata (name, version, supported fields)
- Configuration (enabled, priority, rate limits)
- Lifecycle methods (initialize, healthCheck)
- Built-in rate limiting
- Error handling helpers

**Example:**
```typescript
export interface IDataProvider<TInput, TOutput> {
  readonly metadata: ProviderMetadata;
  readonly config: ProviderConfig;

  initialize(): Promise<void>;
  canEnrich(data: TInput): boolean;
  enrich(data: TInput): Promise<EnrichmentResult<TOutput>>;
  healthCheck(): Promise<boolean>;
}
```

### 2. Data Enricher (`src/lib/enrichment/DataEnricher.ts`)

**Purpose:** Orchestrates multiple providers to enrich data.

**Key Features:**
- Register multiple providers with priorities
- Parallel or sequential execution
- Conflict resolution strategies (priority, merge, first)
- Batch processing support
- Progress tracking
- Error tolerance

**Usage:**
```typescript
const enricher = new DataEnricher();
enricher.registerProvider(new TeleportProvider());
enricher.registerProvider(new WikivoyageProvider());

await enricher.initialize();
const { data, summary } = await enricher.enrich(baseData);
```

### 3. Teleport Provider (`src/lib/providers/teleport/TeleportProvider.ts`)

**Purpose:** Enriches cities with cost of living and quality of life data from Teleport API.

**Provides:**
- Cost of living (housing, food, transportation, utilities)
- Quality of life scores (safety, healthcare, climate)
- Overall city scores
- Category breakdowns

**Features:**
- 7-day caching
- Rate limiting (2 requests/second)
- Fallback data on errors
- City name matching

---

## How to Add a New Provider

Adding a new data source is straightforward. Here's a template:

### Step 1: Create Provider Class

```typescript
// src/lib/providers/myprovider/MyProvider.ts
import { BaseDataProvider } from '../base/DataProvider';

export class MyProvider extends BaseDataProvider<MyInput, MyOutput> {
  readonly metadata = {
    name: 'MyProvider',
    version: '1.0.0',
    description: 'Description of what this provides',
    supportedFields: ['field1', 'field2'],
    requiredFields: ['name']
  };

  readonly config = {
    enabled: true,
    priority: 2,
    baseUrl: 'https://api.example.com',
    rateLimit: {
      requestsPerSecond: 1,
      requestsPerDay: 1000
    }
  };

  canEnrich(data: MyInput): boolean {
    return !!data.name;
  }

  async enrich(data: MyInput): Promise<EnrichmentResult<MyOutput>> {
    // Your enrichment logic here
    const result = await this.fetchData(data);
    return this.createSuccessResult(result, ['field1', 'field2']);
  }

  protected async onHealthCheck(): Promise<boolean> {
    // Test API connectivity
    return true;
  }
}
```

### Step 2: Register in Enrichment Script

```typescript
// scripts/enrich-cities.ts
import { MyProvider } from '../src/lib/providers/myprovider/MyProvider';

// In the initialize method:
this.enricher.registerProvider(new MyProvider());
```

That's it! The provider is now integrated.

---

## Running the Enrichment

### Available Commands

```bash
# Enrich all cities
npm run enrich

# Test with first 5 cities (dry run, verbose)
npm run enrich:test

# Enrich specific city
npm run enrich:city "London"

# Custom options
npm run enrich -- --limit 10 --verbose --dry-run
```

### Command Options

- `--limit <n>` - Only enrich first N cities
- `--city <name>` - Enrich specific city
- `--dry-run` - Don't save changes
- `--verbose` / `-v` - Show detailed output

---

## Conflict Resolution Strategies

When multiple providers return the same field, the enricher uses one of these strategies:

### 1. Priority (Default)
Uses data from the highest priority provider (lowest number).

```typescript
config: { conflictResolution: 'priority' }
```

### 2. First
Uses data from the first successful provider.

```typescript
config: { conflictResolution: 'first' }
```

### 3. Merge
Attempts to intelligently merge data from all providers.

```typescript
config: { conflictResolution: 'merge' }
```

---

## Provider Priority System

Lower numbers = higher priority:

- **Priority 0** - Premium/most accurate data (e.g., Numbeo)
- **Priority 1** - Good quality free data (e.g., Teleport)
- **Priority 2** - Supplementary data (e.g., Wikivoyage)
- **Priority 3+** - Fill-in data / fallbacks

---

## Adapting to Other Topics

This architecture is topic-agnostic. To adapt for a different use case:

### Example: Product Enrichment

1. **Define types:**
```typescript
interface ProductInput {
  name: string;
  sku: string;
}

interface ProductOutput {
  name: string;
  sku: string;
  price?: number;
  reviews?: Review[];
  specifications?: Specs;
}
```

2. **Create providers:**
```typescript
// Amazon provider, BestBuy provider, etc.
class AmazonProvider extends BaseDataProvider<ProductInput, ProductOutput> {
  // Implementation
}
```

3. **Use the same enricher:**
```typescript
const enricher = new DataEnricher<ProductInput, ProductOutput>();
enricher.registerProvider(new AmazonProvider());
```

The core architecture stays the same!

---

## Benefits of This Architecture

✅ **Separation of Concerns** - Providers are isolated from app logic
✅ **Easy to Test** - Each provider can be tested independently
✅ **Swappable** - Replace providers without touching core code
✅ **Type-Safe** - Full TypeScript support with generics
✅ **Scalable** - Add unlimited providers
✅ **Resilient** - Built-in error handling and fallbacks
✅ **Topic-Agnostic** - Works for any programmatic content site
✅ **Rate-Limit Safe** - Automatic rate limiting per provider
✅ **Cacheable** - Built-in caching support

---

## Future Enhancements

### Planned Providers
- **Wikivoyage Provider** - Travel information, cultural notes
- **Numbeo Provider** - Premium cost of living data (if budget allows)
- **GeoNames Provider** - Geographic data, coordinates
- **OpenAI Provider** - AI-generated descriptions and summaries

### Planned Features
- **Scheduled Enrichment** - Cron job for automatic updates
- **Incremental Updates** - Only update changed data
- **Diff Tracking** - Track what changed in each enrichment
- **Provider Analytics** - Success rates, response times
- **Web UI** - Dashboard to trigger enrichments
- **Webhook Support** - Real-time enrichment on data changes

---

## Troubleshooting

### Provider Initialization Fails

**Symptom:** Provider throws error during initialization
**Solution:** Check API connectivity, verify credentials, check health check implementation

### Rate Limiting

**Symptom:** 429 errors from API
**Solution:** Adjust `rateLimit.requestsPerSecond` in provider config

### Conflicts Not Resolving

**Symptom:** Wrong data being used
**Solution:** Check provider priorities, adjust conflict resolution strategy

### Script Hangs

**Symptom:** Script stops mid-execution
**Solution:** Check timeout settings, verify API responses, add logging

---

## Contributing

To contribute a new provider:

1. Create provider class in `src/lib/providers/<name>/`
2. Implement `IDataProvider` interface
3. Add types in `types.ts`
4. Register in enrichment script
5. Add tests
6. Update this document

---

## License

This architecture is part of the Vibe Checker project and follows the same license.
