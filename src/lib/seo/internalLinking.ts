/**
 * Internal Linking System
 *
 * This module provides algorithms for finding similar cities
 * and generating internal links to improve SEO and user experience.
 *
 * The similarity algorithm considers multiple factors:
 * - Geographic proximity (same country, region)
 * - Cost of living similarity
 * - Quality of life similarity
 * - Climate similarity
 */

import type { City } from '@/types/city';

/**
 * Similarity score result
 */
export interface SimilarityScore {
  city: City;
  score: number;
  reasons: string[];
}

/**
 * Calculate similarity between two cities
 * Returns a score from 0 to 1 (higher = more similar)
 */
export function calculateSimilarity(city1: City, city2: City): number {
  let score = 0;
  let maxScore = 0;

  // Geographic similarity (30% weight)
  maxScore += 30;
  if (city1.country === city2.country) {
    score += 30; // Same country = very similar
  } else if (areInSameRegion(city1.country, city2.country)) {
    score += 15; // Same region = somewhat similar
  }

  // Cost of living similarity (25% weight)
  maxScore += 25;
  if (city1.costOfLiving && city2.costOfLiving) {
    const costSimilarity = calculateCostOfLivingSimilarity(
      city1.costOfLiving,
      city2.costOfLiving
    );
    score += costSimilarity * 25;
  }

  // Quality of life similarity (25% weight)
  maxScore += 25;
  if (city1.qualityOfLife && city2.qualityOfLife) {
    const qolSimilarity = calculateQualityOfLifeSimilarity(
      city1.qualityOfLife,
      city2.qualityOfLife
    );
    score += qolSimilarity * 25;
  }

  // Climate similarity (20% weight)
  maxScore += 20;
  if (city1.qualityOfLife?.climate && city2.qualityOfLife?.climate) {
    if (city1.qualityOfLife.climate === city2.qualityOfLife.climate) {
      score += 20;
    }
  }

  // Normalize score to 0-1 range
  return maxScore > 0 ? score / maxScore : 0;
}

/**
 * Calculate cost of living similarity
 * Returns a score from 0 to 1
 */
function calculateCostOfLivingSimilarity(
  cost1: City['costOfLiving'],
  cost2: City['costOfLiving']
): number {
  if (!cost1 || !cost2) return 0;

  const categories = ['housing', 'food', 'transportation', 'utilities'] as const;
  let totalDifference = 0;
  let contributorsCount = 0;

  for (const category of categories) {
    const val1 = cost1[category];
    const val2 = cost2[category];

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      // Calculate relative difference (0 = identical, 1 = very different)
      const maxVal = Math.max(val1, val2);
      if (maxVal > 0) {
        const difference = Math.abs(val1 - val2) / maxVal;
        totalDifference += difference;
        contributorsCount++;
      }
    }
  }

  // Return 0 if no categories contributed
  if (contributorsCount === 0) return 0;

  // Average difference across contributing categories only
  const avgDifference = totalDifference / contributorsCount;

  // Convert to similarity (1 - difference)
  return 1 - Math.min(avgDifference, 1);
}

/**
 * Calculate quality of life similarity
 * Returns a score from 0 to 1
 */
function calculateQualityOfLifeSimilarity(
  qol1: City['qualityOfLife'],
  qol2: City['qualityOfLife']
): number {
  if (!qol1 || !qol2) return 0;

  const categories = ['safety', 'healthcare'] as const;
  let totalDifference = 0;
  let contributorsCount = 0;

  for (const category of categories) {
    const val1 = qol1[category];
    const val2 = qol2[category];

    if (typeof val1 === 'number' && typeof val2 === 'number') {
      // Scores are out of 10, so normalize
      const difference = Math.abs(val1 - val2) / 10;
      totalDifference += difference;
      contributorsCount++;
    }
  }

  // Return 0 if no categories contributed
  if (contributorsCount === 0) return 0;

  // Average difference across contributing categories only
  const avgDifference = totalDifference / contributorsCount;

  // Convert to similarity (1 - difference)
  return 1 - Math.min(avgDifference, 1);
}

/**
 * Check if two countries are in the same region
 * This is a simplified version - can be expanded with proper region data
 */
function areInSameRegion(country1: string, country2: string): boolean {
  const regions: Record<string, string[]> = {
    'Western Europe': [
      'France', 'Germany', 'Belgium', 'Netherlands', 'Luxembourg',
      'Switzerland', 'Austria', 'Ireland'
    ],
    'Southern Europe': [
      'Spain', 'Portugal', 'Italy', 'Greece', 'Malta', 'Cyprus'
    ],
    'Eastern Europe': [
      'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania',
      'Bulgaria', 'Croatia', 'Serbia', 'Slovenia', 'Bosnia and Herzegovina',
      'Albania', 'North Macedonia', 'Kosovo (Disputed Territory)',
      'Montenegro', 'Belarus', 'Ukraine', 'Moldova'
    ],
    'Northern Europe': [
      'United Kingdom', 'Sweden', 'Norway', 'Denmark', 'Finland',
      'Iceland', 'Estonia', 'Latvia', 'Lithuania'
    ],
    'North America': [
      'United States', 'Canada', 'Mexico'
    ],
    'South America': [
      'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Ecuador',
      'Venezuela', 'Uruguay', 'Paraguay', 'Bolivia'
    ],
    'East Asia': [
      'China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong (China)',
      'Mongolia'
    ],
    'Southeast Asia': [
      'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia',
      'Singapore', 'Cambodia', 'Myanmar', 'Laos', 'Brunei'
    ],
    'South Asia': [
      'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal',
      'Bhutan', 'Afghanistan'
    ],
    'Middle East': [
      'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Turkey',
      'Iran', 'Jordan', 'Lebanon', 'Oman', 'Kuwait', 'Bahrain',
      'Qatar', 'Iraq', 'Syria', 'Yemen', 'Palestine'
    ],
    'Africa': [
      'South Africa', 'Egypt', 'Morocco', 'Kenya', 'Nigeria', 'Ghana',
      'Ethiopia', 'Tunisia', 'Algeria', 'Tanzania', 'Uganda', 'Rwanda',
      'Namibia', 'Senegal', 'Ivory Coast', 'Cameroon'
    ],
    'Oceania': [
      'Australia', 'New Zealand', 'Fiji', 'Papua New Guinea'
    ],
    'Caribbean': [
      'Jamaica', 'Trinidad and Tobago', 'Bahamas', 'Barbados',
      'Dominican Republic', 'Puerto Rico', 'Cuba', 'Haiti'
    ],
    'Central America': [
      'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador',
      'Nicaragua', 'Belize'
    ],
  };

  // Find which regions contain each country
  for (const countries of Object.values(regions)) {
    if (countries.includes(country1) && countries.includes(country2)) {
      return true;
    }
  }

  return false;
}

/**
 * Find similar cities for a given city
 * Returns an array of cities sorted by similarity (most similar first)
 */
export function findSimilarCities(
  targetCity: City,
  allCities: City[],
  options: {
    limit?: number;
    minScore?: number;
    excludeSameCountry?: boolean;
  } = {}
): SimilarityScore[] {
  const {
    limit = 5,
    minScore = 0.3,
    excludeSameCountry = false,
  } = options;

  const scores: SimilarityScore[] = [];

  for (const city of allCities) {
    // Skip the target city itself
    if (city.slug === targetCity.slug) {
      continue;
    }

    // Skip same country if requested
    if (excludeSameCountry && city.country === targetCity.country) {
      continue;
    }

    const score = calculateSimilarity(targetCity, city);

    // Only include if meets minimum score
    if (score >= minScore) {
      const reasons = generateSimilarityReasons(targetCity, city);

      scores.push({
        city,
        score,
        reasons,
      });
    }
  }

  // Sort by score (descending) and limit results
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Generate human-readable reasons for similarity
 */
function generateSimilarityReasons(city1: City, city2: City): string[] {
  const reasons: string[] = [];

  if (city1.country === city2.country) {
    reasons.push('Same country');
  } else if (areInSameRegion(city1.country, city2.country)) {
    reasons.push('Same region');
  }

  if (city1.costOfLiving && city2.costOfLiving) {
    const similarity = calculateCostOfLivingSimilarity(
      city1.costOfLiving,
      city2.costOfLiving
    );
    if (similarity > 0.8) {
      reasons.push('Similar cost of living');
    }
  }

  if (city1.qualityOfLife && city2.qualityOfLife) {
    const similarity = calculateQualityOfLifeSimilarity(
      city1.qualityOfLife,
      city2.qualityOfLife
    );
    if (similarity > 0.8) {
      reasons.push('Similar quality of life');
    }
  }

  if (
    city1.qualityOfLife?.climate &&
    city2.qualityOfLife?.climate &&
    city1.qualityOfLife.climate === city2.qualityOfLife.climate
  ) {
    reasons.push('Similar climate');
  }

  return reasons;
}

/**
 * Get popular city comparisons (for "Popular Comparisons" section)
 * These are pre-defined popular comparisons that users often search for
 */
export function getPopularComparisons(city: City): Array<{
  city1: City;
  city2Name: string;
  city2Slug: string;
}> {
  // This is a simple version - in production, this could be based on
  // analytics data showing which comparisons users actually click on

  const popularPairs: Record<string, string[]> = {
    // Major tech hubs
    'San Francisco': ['New York', 'Austin', 'Seattle', 'Boston'],
    'New York': ['San Francisco', 'Los Angeles', 'Chicago', 'London'],
    'London': ['Paris', 'Berlin', 'Amsterdam', 'New York'],
    'Berlin': ['Amsterdam', 'Prague', 'London', 'Barcelona'],

    // Popular expat destinations
    'Bangkok': ['Chiang Mai', 'Singapore', 'Ho Chi Minh City', 'Kuala Lumpur'],
    'Lisbon': ['Porto', 'Barcelona', 'Valencia', 'Athens'],
    'Barcelona': ['Madrid', 'Valencia', 'Lisbon', 'Berlin'],

    // Add more as needed
  };

  const cityName = city.name;
  const popularCities = popularPairs[cityName] || [];

  return popularCities.slice(0, 3).map((otherCityName) => ({
    city1: city,
    city2Name: otherCityName,
    city2Slug: generateSlugFromName(otherCityName),
  }));
}

/**
 * Generate a slug from a city name (simplified version)
 * In production, you'd want to look up the actual slug from your data
 */
function generateSlugFromName(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
