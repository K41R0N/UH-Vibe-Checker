# Data Sources Implementation Roadmap

This document tracks planned data source integrations for the Vibe Checker programmatic architecture.

---

## ✅ Implemented

### OpenWeather API
- **Status:** ✅ Fully Implemented
- **Priority:** High
- **Cost:** FREE (60 calls/min, 1M calls/month)
- **Data Provided:** Current weather, forecasts
- **Implementation:** `src/lib/api/providers/weather.ts`
- **Notes:** Already integrated into build process with fallback data

### Teleport API
- **Status:** ✅ Provider Built (Not Yet Enriched)
- **Priority:** High
- **Cost:** FREE (unlimited)
- **Data Provided:**
  - Cost of living scores
  - Quality of life metrics (safety, healthcare, climate)
  - Salaries
  - Overall city scores
- **Coverage:** 266 major cities
- **Implementation:** `src/lib/providers/teleport/TeleportProvider.ts`
- **Next Steps:** Run enrichment when environment allows API access

---

## 🚀 Priority 1: Free APIs (Implement Next)

### Wikivoyage API
- **Status:** 📋 Planned
- **Priority:** HIGH
- **Cost:** FREE (unlimited)
- **API Endpoint:** `https://en.wikivoyage.org/w/api.php` or `https://api.wikimedia.org/wiki/Travel`
- **Data Provided:**
  - Travel guides and destination information
  - Getting around (transport info)
  - Cultural notes and etiquette
  - Practical information (visa, language, currency)
  - Safety information
  - Things to see and do
  - Seasonal information
- **Coverage:** Thousands of destinations
- **License:** Creative Commons (free to use)
- **Implementation Plan:**
  - Create `src/lib/providers/wikivoyage/WikivoyageProvider.ts`
  - Parse MediaWiki API responses
  - Extract structured data from wiki markup
  - Map to `WikiTravelData` type
- **Estimated Effort:** 4-6 hours
- **Notes:**
  - Content quality varies by city
  - May need HTML/markup parsing
  - Rich human-written content

### REST Countries API
- **Status:** 📋 Planned
- **Priority:** MEDIUM
- **Cost:** FREE (no key required)
- **API Endpoint:** `https://restcountries.com/`
- **Data Provided:**
  - Country information (capitals, languages, currencies)
  - Population, area
  - Flags, timezones
- **Coverage:** All countries
- **Implementation Plan:**
  - Create `src/lib/providers/restcountries/RestCountriesProvider.ts`
  - Add country-level context to cities
  - Enrich currency, language, timezone data
- **Estimated Effort:** 2-3 hours
- **Notes:** Country-level only (not city-specific)

### GeoDB Cities API
- **Status:** 📋 Planned
- **Priority:** LOW
- **Cost:** FREE (500 requests/day)
- **API Endpoint:** `http://geodb-free-service.wirefreethought.com/`
- **Data Provided:**
  - Geographic coordinates
  - Population data
  - Timezones
  - City/country relationships
- **Coverage:** 4M+ cities
- **Implementation Plan:**
  - Create `src/lib/providers/geodb/GeoDBProvider.ts`
  - Fill gaps for cities not in other sources
  - Add precise coordinates
- **Estimated Effort:** 3-4 hours
- **Notes:** Best for filling data gaps

---

## 💰 Priority 2: Premium/Paid APIs (If Budget Allows)

### Numbeo API
- **Status:** 📋 Planned
- **Priority:** MEDIUM (if budget available)
- **Cost:** $260/month (or FREE academic key)
- **API Endpoint:** `https://www.numbeo.com/api/`
- **Data Provided:**
  - Detailed cost of living (600+ cities)
  - Granular item prices (milk, bread, taxi fares, etc.)
  - Housing costs and rent prices
  - Purchasing power index
  - Historical data
- **Coverage:** 600+ cities
- **Implementation Plan:**
  - Apply for academic API key (free)
  - OR subscribe to commercial API
  - Create `src/lib/providers/numbeo/NumbeoProvider.ts`
  - Set priority to 0 (highest quality data)
- **Estimated Effort:** 3-4 hours
- **Next Steps:**
  1. Apply for academic key: https://www.numbeo.com/common/apply_academic_api.jsp
  2. If approved, implement provider
- **Notes:** Most comprehensive cost of living database

---

## 🤖 Priority 3: AI-Enhanced Data

### OpenAI API
- **Status:** 💡 Future Enhancement
- **Priority:** LOW
- **Cost:** Pay-per-use (~$0.002/1K tokens)
- **API Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Data Provided:**
  - AI-generated city descriptions
  - Summaries of existing data
  - Personalized recommendations
  - Content enhancement
- **Implementation Plan:**
  - Create `src/lib/providers/openai/OpenAIProvider.ts`
  - Use GPT-4 for content generation
  - Add caching to minimize costs
  - Implement rate limiting
- **Estimated Effort:** 4-6 hours
- **Notes:**
  - Use sparingly to control costs
  - Cache aggressively
  - Consider running batch jobs weekly

### Hugging Face API
- **Status:** 💡 Future Enhancement
- **Priority:** LOW
- **Cost:** FREE tier available
- **API Endpoint:** `https://api-inference.huggingface.co/models/`
- **Data Provided:**
  - Sentiment analysis
  - Text classification
  - Content summarization
- **Implementation Plan:**
  - Create `src/lib/providers/huggingface/HuggingFaceProvider.ts`
  - Use for content enhancement
- **Estimated Effort:** 3-4 hours

---

## 📊 Priority 4: Specialized Data Sources

### World Bank API
- **Status:** 💡 Future Enhancement
- **Priority:** LOW
- **Cost:** FREE
- **API Endpoint:** `https://api.worldbank.org/v2/`
- **Data Provided:**
  - Economic indicators
  - Development statistics
  - Country-level data
- **Coverage:** Global
- **Estimated Effort:** 4-5 hours

### United Nations Data API
- **Status:** 💡 Future Enhancement
- **Priority:** LOW
- **Cost:** FREE
- **Data Provided:**
  - Development indicators
  - Demographic data
  - Social statistics
- **Estimated Effort:** 4-5 hours

### OpenStreetMap Nominatim
- **Status:** 💡 Future Enhancement
- **Priority:** LOW
- **Cost:** FREE (with rate limits)
- **API Endpoint:** `https://nominatim.openstreetmap.org/`
- **Data Provided:**
  - Geocoding
  - Reverse geocoding
  - Address data
- **Implementation Plan:**
  - For precise location data
  - Map city names to coordinates
- **Estimated Effort:** 2-3 hours
- **Notes:** Must respect usage policy

---

## 🔄 Enrichment Schedule

### Weekly Enrichments
- OpenWeather API (already live)
- Wikivoyage (when implemented)
- REST Countries (when implemented)

### Monthly Enrichments
- Teleport API
- GeoDB Cities
- Numbeo (if using)

### Quarterly Enrichments
- AI-generated content (OpenAI/Hugging Face)
- World Bank data
- UN data

---

## 📈 Implementation Priority Order

1. **Phase 1 (Next Sprint):**
   - ✅ Complete Teleport enrichment (provider exists)
   - 🚀 Implement Wikivoyage provider
   - 🚀 Implement REST Countries provider

2. **Phase 2 (Following Sprint):**
   - Apply for Numbeo academic API key
   - Implement GeoDB Cities provider
   - Set up scheduled enrichments (GitHub Actions or cron)

3. **Phase 3 (Future):**
   - Implement Numbeo provider (if approved)
   - Add AI providers (OpenAI/Hugging Face)
   - Add specialized sources (World Bank, UN)

4. **Phase 4 (Polish):**
   - Provider analytics dashboard
   - Real-time enrichment webhooks
   - Diff tracking and change logs
   - Provider performance monitoring

---

## 🛠️ Technical Debt & Improvements

### Provider Infrastructure
- [ ] Add provider health check dashboard
- [ ] Implement provider analytics (success rates, response times)
- [ ] Add diff tracking between enrichments
- [ ] Create web UI for triggering enrichments
- [ ] Add webhook support for real-time updates
- [ ] Implement incremental updates (only update changed data)

### Testing
- [ ] Unit tests for each provider
- [ ] Integration tests for enrichment pipeline
- [ ] Mock API responses for testing
- [ ] Performance benchmarks

### Documentation
- [ ] API documentation for each provider
- [ ] Troubleshooting guides
- [ ] Performance optimization tips
- [ ] Cost analysis per provider

---

## 💡 Ideas for Future Data Sources

### Travel & Tourism
- TripAdvisor API (reviews, ratings)
- Airbnb data (accommodation prices)
- Booking.com API (hotel data)
- Skyscanner API (flight prices)

### Living & Working
- Nomad List API (digital nomad data)
- Expatistan API (expat cost comparisons)
- LinkedIn API (job market data)
- Indeed API (salary data)

### Safety & Health
- WHO API (health statistics)
- Crime data APIs (safety scores)
- Air quality APIs (pollution data)
- Hospital quality databases

### Culture & Community
- Meetup API (events, communities)
- Facebook Events API
- Eventbrite API
- Reddit API (community discussions)

---

## 📝 Notes

- All free APIs should be implemented first
- Paid APIs require business justification
- AI-generated content needs careful review
- Cache all API responses aggressively
- Respect rate limits and terms of service
- Document data sources and attribution
- Consider data freshness requirements
- Monitor API costs and usage

---

## 🎯 Success Metrics

### Coverage
- Target: 90% of cities have cost of living data
- Target: 80% of cities have quality of life scores
- Target: 95% of cities have travel information

### Data Quality
- Target: 95% data accuracy
- Target: < 10% missing critical fields
- Target: < 30 days data staleness

### Performance
- Target: < 5 seconds enrichment per city
- Target: > 95% provider uptime
- Target: < $50/month API costs

---

Last Updated: 2025-11-13
