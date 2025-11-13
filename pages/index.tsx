import { useState, useMemo } from 'react';
import { GetStaticProps } from 'next';
import { City } from '@/types/city';
import { CityService } from '@/lib/services/cityService';
import Head from 'next/head';
import {
  generateHomepageStructuredData,
  stringifyStructuredData,
} from '@/lib/seo/structuredData';
import { siteConfig } from '@/lib/config/site';
import {
  Hero,
  HeroTitle,
  HeroSubtitle,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  Card,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  StatsGrid,
  DataItem,
} from '@/components/ui';

// Configuration
export const ITEMS_PER_PAGE = 20;

interface HomeProps {
  initialCities: City[];
  totalCities: number;
  pageSize: number;
}

export default function Home({ initialCities, totalCities, pageSize }: HomeProps) {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const loadMore = async () => {
    if (loading || cities.length >= totalCities) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const result = await fetch(`/api/cities?page=${nextPage}&pageSize=${pageSize}`);
      const data = await result.json();

      if (data.cities?.length) {
        setCities((prev) => [...prev, ...data.cities]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more cities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique regions for filtering
  const regions = useMemo(() => {
    const uniqueRegions = new Set(cities.map(city => {
      // Simple region extraction from country (could be enhanced with actual region data)
      return city.country;
    }));
    return Array.from(uniqueRegions).sort();
  }, [cities]);

  // Filter cities based on search and region
  const filteredCities = useMemo(() => {
    return cities.filter(city => {
      const matchesSearch = searchQuery === '' ||
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === 'all' || city.country === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [cities, searchQuery, selectedRegion]);

  // Calculate stats from cities
  const stats = useMemo(() => {
    const withCostData = cities.filter(c => c.costOfLiving).length;
    const withWeatherData = cities.filter(c => c.weather).length;
    const citiesWithHousing = cities.filter(c => c.costOfLiving?.housing);
    const avgHousing = citiesWithHousing.length > 0
      ? citiesWithHousing.reduce((sum, c) => sum + (c.costOfLiving?.housing || 0), 0) / citiesWithHousing.length
      : 0;

    return [
      { label: 'Cities Worldwide', value: totalCities },
      { label: 'Countries Covered', value: regions.length },
      { label: 'Avg. Housing Cost', value: avgHousing > 0 ? `$${Math.round(avgHousing)}/mo` : 'N/A' },
      { label: 'Data Points', value: `${withCostData + withWeatherData}+` },
    ];
  }, [cities, totalCities, regions.length]);

  // Get featured cities (with complete data)
  const featuredCities = useMemo(() => {
    return cities
      .filter(c => c.costOfLiving && c.weather && c.qualityOfLife)
      .slice(0, 6);
  }, [cities]);

  // Generate structured data for SEO
  const structuredData = generateHomepageStructuredData(cities, totalCities);

  return (
    <>
      <Head>
        <title>Vibe Checker — Discover Your Perfect City</title>
        <meta
          name="description"
          content="Explore comprehensive city guides for digital nomads and travelers. Compare cost of living, quality of life, and local insights for destinations worldwide."
        />
        <meta property="og:title" content="Vibe Checker — Discover Your Perfect City" />
        <meta
          property="og:description"
          content="Explore comprehensive city guides for digital nomads and travelers. Compare cost of living, quality of life, and local insights for destinations worldwide."
        />
        <link rel="canonical" href={siteConfig.url} />

        {/* Structured Data - JSON-LD for SEO */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD data is sanitized through stringifyStructuredData */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(structuredData),
          }}
        />
      </Head>

      {/* Hero Section */}
      <Hero size="lg">
        <div className="animate-fade-in-up">
          <Badge className="mb-6">Discover {totalCities}+ Cities Worldwide</Badge>
          <HeroTitle>
            Find Your
            <br />
            Perfect City
          </HeroTitle>
          <HeroSubtitle className="mx-auto max-w-3xl">
            Make data-driven decisions with comprehensive city guides. Compare cost of living, quality of life, weather, and local insights for destinations worldwide.
          </HeroSubtitle>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="relative">
              <svg
                className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 text-body-lg border-2 border-black-200 bg-white focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </Hero>

      {/* Quick Stats Section */}
      <Section padding="md" background="white">
        <StatsGrid stats={stats} />
      </Section>

      {/* Featured Cities Section */}
      {featuredCities.length > 0 && (
        <Section padding="lg" background="cream">
          <SectionHeader>
            <SectionTitle>Featured Destinations</SectionTitle>
            <SectionDescription>
              Top cities with complete data on cost of living, weather, and quality of life metrics.
            </SectionDescription>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredCities.map((city) => (
              <Card
                key={city.id || `${city.name}-${city.country}`.toLowerCase()}
                href={`/cities/${city.slug}`}
                className="group"
              >
                {/* City Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="group-hover:text-black-700 transition-colors flex-1">
                      {city.name}
                    </CardTitle>
                    {city.qualityOfLife?.safety && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {city.qualityOfLife.safety}/10
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-sm text-black-500 uppercase tracking-wide">
                    {city.country}
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {city.costOfLiving?.housing && (
                    <div className="bg-cream-100 border border-black-100 p-3">
                      <div className="text-body-xs text-black-500 uppercase tracking-wide mb-1">
                        Housing
                      </div>
                      <div className="text-body-lg font-bold">${city.costOfLiving.housing}</div>
                    </div>
                  )}
                  {city.weather && (
                    <div className="bg-cream-100 border border-black-100 p-3">
                      <div className="text-body-xs text-black-500 uppercase tracking-wide mb-1">
                        Weather
                      </div>
                      <div className="text-body-sm font-medium">{city.weather.temperature}°C</div>
                    </div>
                  )}
                  {city.qualityOfLife?.healthcare && (
                    <div className="bg-cream-100 border border-black-100 p-3">
                      <div className="text-body-xs text-black-500 uppercase tracking-wide mb-1">
                        Healthcare
                      </div>
                      <div className="text-body-sm font-medium">{city.qualityOfLife.healthcare}/10</div>
                    </div>
                  )}
                  {city.qualityOfLife?.climate && (
                    <div className="bg-cream-100 border border-black-100 p-3">
                      <div className="text-body-xs text-black-500 uppercase tracking-wide mb-1">
                        Climate
                      </div>
                      <div className="text-body-sm font-medium">{city.qualityOfLife.climate}</div>
                    </div>
                  )}
                </div>

                {/* View Details Link */}
                <div className="mt-6 flex items-center text-body-sm font-medium group-hover:translate-x-2 transition-transform">
                  <span>View Full Profile</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* All Cities Section */}
      <Section padding="lg" background="white">
        <SectionHeader>
          <SectionTitle>Explore All Cities</SectionTitle>
          <SectionDescription>
            Browse our complete collection of {totalCities}+ cities worldwide. Filter by region to find your ideal destination.
          </SectionDescription>
        </SectionHeader>

        {/* Filter Controls */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-body-sm font-medium text-black-600">Filter by region:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-4 py-2 text-body-sm font-medium border-2 transition-all ${
                  selectedRegion === 'all'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black-200 hover:border-black-400'
                }`}
              >
                All Regions
              </button>
              {regions.slice(0, 8).map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 text-body-sm font-medium border-2 transition-all ${
                    selectedRegion === region
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black-200 hover:border-black-400'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Info */}
          {(searchQuery || selectedRegion !== 'all') && (
            <div className="flex items-center justify-between p-4 bg-cream-100 border border-black-200">
              <p className="text-body-sm text-black-600">
                Showing <span className="font-bold">{filteredCities.length}</span> {filteredCities.length === 1 ? 'city' : 'cities'}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedRegion !== 'all' && ` in ${selectedRegion}`}
              </p>
              {(searchQuery || selectedRegion !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                  }}
                  className="text-body-sm font-medium text-black hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {filteredCities.length === 0 ? (
          <div className="text-center py-16 bg-cream-50 border-2 border-dashed border-black-200">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-black-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-body-lg font-medium text-black-600 mb-2">
              No cities found
            </p>
            <p className="text-body-md text-black-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
              variant="secondary"
              size="md"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Cities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {filteredCities.map((city, index) => (
                <Card
                  key={city.id || `${city.name}-${city.country}`.toLowerCase()}
                  href={`/cities/${city.slug}`}
                  className="group"
                >
                  {/* City Header */}
                  <div className="mb-3">
                    <CardTitle className="group-hover:text-black-700 transition-colors">
                      {city.name}
                    </CardTitle>
                    <p className="text-body-sm text-black-500 uppercase tracking-wide">
                      {city.country}
                    </p>
                  </div>

                  {/* City Description */}
                  {city.description && (
                    <CardDescription className="mb-4 line-clamp-2">
                      {city.description}
                    </CardDescription>
                  )}

                  {/* City Stats */}
                  {(city.costOfLiving || city.weather || city.qualityOfLife) && (
                    <div className="space-y-2 pt-4 border-t border-black-100 mb-4">
                      {city.costOfLiving?.housing && (
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-black-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Housing
                          </span>
                          <span className="font-medium">${city.costOfLiving.housing}/mo</span>
                        </div>
                      )}
                      {city.weather && (
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-black-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Weather
                          </span>
                          <span className="font-medium">
                            {city.weather.temperature}°C
                          </span>
                        </div>
                      )}
                      {city.qualityOfLife?.safety && (
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-black-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Safety
                          </span>
                          <span className="font-medium">{city.qualityOfLife.safety}/10</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Details Link */}
                  <div className="flex items-center text-body-sm font-medium group-hover:translate-x-2 transition-transform">
                    <span>Explore City</span>
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {!searchQuery && selectedRegion === 'all' && cities.length < totalCities && (
              <div className="flex justify-center">
                <Button
                  onClick={loadMore}
                  variant="secondary"
                  size="lg"
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Load More Cities`
                  )}
                </Button>
              </div>
            )}

            {cities.length >= totalCities && (
              <div className="text-center py-12 bg-cream-50 border border-black-100">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-black-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-body-lg font-medium text-black-600 mb-2">
                  You've explored all {totalCities} cities!
                </p>
                <p className="text-body-md text-black-500">
                  Check back soon for new destinations
                </p>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    console.log('[Build] Starting getStaticProps for homepage...');
    const { cities, total } = await CityService.getCities(1, false); // Don't load weather for initial page
    console.log(`[Build] Successfully loaded ${cities.length} cities, total: ${total}`);

    return {
      props: {
        initialCities: cities,
        totalCities: total,
        pageSize: ITEMS_PER_PAGE,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('[Build] Error in homepage getStaticProps:', error);
    if (error instanceof Error) {
      console.error('[Build] Error stack:', error.stack);
      console.error('[Build] Error message:', error.message);
    }
    return {
      props: {
        initialCities: [],
        totalCities: 0,
        pageSize: ITEMS_PER_PAGE,
      },
      revalidate: 60, // Retry sooner if there was an error
    };
  }
};
