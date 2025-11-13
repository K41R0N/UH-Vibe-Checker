import { useState } from 'react';
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
          <HeroSubtitle className="mx-auto">
            Comprehensive city guides with real data on cost of living, quality of life, and everything you need to know before making your move.
          </HeroSubtitle>
        </div>
      </Hero>

      {/* Cities Grid Section */}
      <Section padding="lg" background="cream">
        <SectionHeader>
          <SectionTitle className="animate-fade-in-up">
            Explore Cities
          </SectionTitle>
          <SectionDescription className="animate-fade-in-up animate-delay-100">
            Browse through our curated collection of cities worldwide. Each guide includes detailed information on cost of living, quality of life metrics, and local insights.
          </SectionDescription>
        </SectionHeader>

        {cities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-body-lg text-black-500">
              No cities available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Cities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {cities.map((city, index) => (
                <Card
                  key={city.id || `${city.name}-${city.country}`.toLowerCase()}
                  href={`/cities/${city.slug}`}
                  className={`group animate-fade-in-up animate-delay-${Math.min(index * 100, 500)}`}
                >
                  {/* City Header */}
                  <div className="mb-4">
                    <CardTitle className="group-hover:text-black-700 transition-colors">
                      {city.name}
                    </CardTitle>
                    <p className="text-body-sm text-black-500 uppercase tracking-wide">
                      {city.country}
                    </p>
                  </div>

                  {/* City Description */}
                  <CardDescription className="mb-4 line-clamp-2">
                    {city.description}
                  </CardDescription>

                  {/* City Stats */}
                  {(city.costOfLiving || city.weather) && (
                    <div className="space-y-2 pt-4 border-t border-black-100">
                      {city.costOfLiving && (
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-black-500">Housing</span>
                          <span className="font-medium">${city.costOfLiving.housing}/mo</span>
                        </div>
                      )}
                      {city.weather && (
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-black-500">Weather</span>
                          <span className="font-medium">
                            {city.weather.temperature}°C, {city.weather.condition}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Details Link */}
                  <div className="mt-6 flex items-center text-body-sm font-medium group-hover:translate-x-2 transition-transform">
                    <span>View Details</span>
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {cities.length < totalCities && (
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
              <div className="text-center py-8">
                <p className="text-body-md text-black-500">
                  You've viewed all {totalCities} cities
                </p>
              </div>
            )}
          </>
        )}
      </Section>

      {/* Stats Section */}
      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-display-md font-display font-bold mb-2">{totalCities}+</div>
            <div className="text-body-lg text-black-600">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-display-md font-display font-bold mb-2">100+</div>
            <div className="text-body-lg text-black-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-display-md font-display font-bold mb-2">24/7</div>
            <div className="text-body-lg text-black-600">Updated Data</div>
          </div>
        </div>
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
