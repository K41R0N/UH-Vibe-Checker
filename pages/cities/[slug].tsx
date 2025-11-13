import { GetStaticPaths, GetStaticProps } from 'next';
import { City } from '@/types/city';
import { CityService } from '@/lib/services/cityService';
import Head from 'next/head';
import Link from 'next/link';
import {
  generateCityPageStructuredData,
  generateDefaultCityFAQs,
  generateFAQSchema,
  stringifyStructuredData,
} from '@/lib/seo/structuredData';
import { findSimilarCities, SimilarityScore } from '@/lib/seo/internalLinking';
import { getEntityUrl, getAbsoluteUrl } from '@/lib/config/site';
import {
  Section,
  SectionHeader,
  SectionTitle,
  Card,
  CardTitle,
  DataGrid,
  DataItem,
  Badge,
  Button,
} from '@/components/ui';

interface CityPageProps {
  city?: City;
  similarCities?: SimilarityScore[];
  error?: string | null;
}

const DataUnavailableMessage = () => (
  <div className="p-6 bg-cream-200 border border-black-200 text-body-md text-black-600">
    <p className="font-medium mb-1">Temporarily Unavailable</p>
    <p className="text-body-sm">We're having trouble fetching this data. Please check back later.</p>
  </div>
);

export default function CityPage({ city, similarCities = [], error }: CityPageProps) {
  if (error) {
    return (
      <>
        <Head>
          <title>Error Loading City - Vibe Checker</title>
          <meta name="description" content="There was an error loading the city data." />
        </Head>
        <Section padding="lg">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-display-md font-display font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-body-lg text-black-600 mb-8">{error}</p>
            <Button href="/" variant="primary" size="lg">
              Return to Homepage
            </Button>
          </div>
        </Section>
      </>
    );
  }

  if (!city || !city.metadata) {
    return (
      <>
        <Head>
          <title>Loading City Data - Vibe Checker</title>
          <meta name="description" content="Loading city information..." />
        </Head>
        <Section padding="lg">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-display-md font-display font-bold mb-4">Loading City Data</h1>
            <p className="text-body-lg text-black-600">Please wait while we fetch the city information...</p>
          </div>
        </Section>
      </>
    );
  }

  // Generate structured data for SEO
  const structuredData = generateCityPageStructuredData(city);
  const cityFAQs = generateDefaultCityFAQs(city);
  const faqSchema = generateFAQSchema(cityFAQs);

  return (
    <>
      <Head>
        <title>{city.metadata.title}</title>
        <meta name="description" content={city.metadata.description} />
        <meta name="keywords" content={city.metadata.keywords.join(', ')} />
        <meta property="og:title" content={city.metadata.title} />
        <meta property="og:description" content={city.metadata.description} />
        <link rel="canonical" href={getAbsoluteUrl(getEntityUrl(city.slug))} />

        {/* Structured Data - JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(faqSchema),
          }}
        />
      </Head>

      {/* Hero / Header */}
      <Section padding="lg" background="cream">
        <div className="max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-body-sm text-black-600 hover:text-black transition-colors mb-8 group"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all cities
          </Link>

          <div className="mb-6">
            <Badge className="mb-4">{city.country}</Badge>
            <h1 className="text-display-lg font-display font-bold mb-6 animate-fade-in-up">
              {city.name}
            </h1>
            <p className="text-body-xl text-black-600 max-w-2xl animate-fade-in-up animate-delay-100">
              {city.description}
            </p>
          </div>
        </div>
      </Section>

      {/* Cost of Living */}
      <Section padding="md" background="white">
        <SectionHeader>
          <SectionTitle>Cost of Living</SectionTitle>
        </SectionHeader>

        {city.costOfLiving ? (
          <DataGrid columns={4}>
            <DataItem label="Housing" value={`$${city.costOfLiving.housing}`} />
            <DataItem label="Food" value={`$${city.costOfLiving.food}`} />
            <DataItem label="Transportation" value={`$${city.costOfLiving.transportation}`} />
            <DataItem label="Utilities" value={`$${city.costOfLiving.utilities}`} />
          </DataGrid>
        ) : (
          <DataUnavailableMessage />
        )}
      </Section>

      {/* Quality of Life */}
      <Section padding="md" background="cream">
        <SectionHeader>
          <SectionTitle>Quality of Life</SectionTitle>
        </SectionHeader>

        {city.qualityOfLife ? (
          <DataGrid columns={3}>
            <DataItem label="Safety Score" value={`${city.qualityOfLife.safety}/10`} />
            <DataItem label="Healthcare" value={`${city.qualityOfLife.healthcare}/10`} />
            <DataItem label="Climate" value={city.qualityOfLife.climate} />
          </DataGrid>
        ) : (
          <DataUnavailableMessage />
        )}
      </Section>

      {/* Current Weather */}
      <Section padding="md" background="white">
        <SectionHeader>
          <SectionTitle>Current Weather</SectionTitle>
        </SectionHeader>

        {city.weather ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DataItem label="Temperature" value={`${city.weather.temperature}°C`} layout="horizontal" />
            <DataItem label="Condition" value={city.weather.condition} layout="horizontal" />
            <DataItem label="Humidity" value={`${city.weather.humidity}%`} layout="horizontal" />
          </div>
        ) : (
          <DataUnavailableMessage />
        )}
      </Section>

      {/* Additional Information */}
      {city.wikiData && (
        <>
          {city.wikiData.overview && (
            <Section padding="md" background="cream">
              <SectionHeader>
                <SectionTitle>Overview</SectionTitle>
              </SectionHeader>
              <div className="prose prose-lg max-w-none">
                <p className="text-body-lg text-black-700 leading-relaxed">{city.wikiData.overview}</p>
              </div>
            </Section>
          )}

          {city.wikiData.gettingAround && (
            <Section padding="md" background="white">
              <SectionHeader>
                <SectionTitle>Getting Around</SectionTitle>
              </SectionHeader>
              <DataGrid columns={2}>
                {city.wikiData.gettingAround.byPublicTransport && (
                  <Card padding="md">
                    <h3 className="text-heading-sm font-display font-bold mb-3">Public Transport</h3>
                    <p className="text-body-md text-black-600">{city.wikiData.gettingAround.byPublicTransport}</p>
                  </Card>
                )}
                {city.wikiData.gettingAround.byTaxi && (
                  <Card padding="md">
                    <h3 className="text-heading-sm font-display font-bold mb-3">Taxis</h3>
                    <p className="text-body-md text-black-600">{city.wikiData.gettingAround.byTaxi}</p>
                  </Card>
                )}
                {city.wikiData.gettingAround.byBike && (
                  <Card padding="md">
                    <h3 className="text-heading-sm font-display font-bold mb-3">Cycling</h3>
                    <p className="text-body-md text-black-600">{city.wikiData.gettingAround.byBike}</p>
                  </Card>
                )}
                {city.wikiData.gettingAround.walking && (
                  <Card padding="md">
                    <h3 className="text-heading-sm font-display font-bold mb-3">Walking</h3>
                    <p className="text-body-md text-black-600">{city.wikiData.gettingAround.walking}</p>
                  </Card>
                )}
              </DataGrid>
            </Section>
          )}

          {city.wikiData.practicalInfo && (
            <Section padding="md" background="cream">
              <SectionHeader>
                <SectionTitle>Practical Information</SectionTitle>
              </SectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {city.wikiData.practicalInfo.visaRequirements && (
                  <DataItem label="Visa Requirements" value={city.wikiData.practicalInfo.visaRequirements} layout="horizontal" />
                )}
                {city.wikiData.practicalInfo.language && (
                  <DataItem label="Language" value={city.wikiData.practicalInfo.language} layout="horizontal" />
                )}
                {city.wikiData.practicalInfo.currency && (
                  <DataItem label="Currency" value={city.wikiData.practicalInfo.currency} layout="horizontal" />
                )}
              </div>
            </Section>
          )}

          {city.wikiData.seasonalInfo?.bestTimeToVisit && (
            <Section padding="md" background="white">
              <SectionHeader>
                <SectionTitle>Best Time to Visit</SectionTitle>
              </SectionHeader>
              <div className="prose prose-lg max-w-none">
                <p className="text-body-lg text-black-700 leading-relaxed">
                  {city.wikiData.seasonalInfo.bestTimeToVisit}
                </p>
              </div>
            </Section>
          )}
        </>
      )}

      {/* Similar Cities Section */}
      {similarCities && similarCities.length > 0 && (
        <Section padding="lg" background="cream">
          <SectionHeader>
            <SectionTitle>Similar Cities</SectionTitle>
            <p className="text-body-lg text-black-600 mt-4">
              Explore these cities that share similar characteristics with {city.name}
            </p>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCities.map((similar) => (
              <Card key={similar.city.slug} href={`/cities/${similar.city.slug}`} padding="md" className="group">
                <CardTitle className="group-hover:text-black-700 transition-colors mb-2">
                  {similar.city.name}
                </CardTitle>
                <p className="text-body-sm text-black-500 uppercase tracking-wide mb-4">
                  {similar.city.country}
                </p>

                {similar.reasons.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-black-100">
                    {similar.reasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-center text-body-sm text-black-600">
                        <span className="mr-2 text-black-400">•</span>
                        {reason}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center text-body-sm font-medium group-hover:translate-x-2 transition-transform">
                  <span>View City</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    console.log('[Build] Starting getStaticPaths for city pages...');
    const paths = await CityService.generateStaticPaths();
    console.log(`[Build] Generated ${paths.length} city paths`);
    return {
      paths,
      fallback: true, // Allow ISR for new paths
    };
  } catch (error) {
    console.error('[Build] Error in getStaticPaths:', error);
    if (error instanceof Error) {
      console.error('[Build] Error stack:', error.stack);
      console.error('[Build] Error message:', error.message);
    }
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps<CityPageProps> = async (context) => {
  try {
    const slug = context.params?.slug as string;
    console.log(`[Build] Getting city data for slug: ${slug}`);
    const result = await CityService.getCityBySlug(slug);

    if (!result.city) {
      // If we have an error message, we'll show it on a custom error page
      if (result.error) {
        console.log(`[Build] City not found or error: ${result.error}`);
        return {
          props: {
            error: result.error,
          },
          revalidate: 60, // Try again sooner for error cases
        };
      }
      // If no error message, use 404
      console.log(`[Build] City ${slug} not found, returning 404`);
      return { notFound: true };
    }

    // Find similar cities for internal linking
    const allCities = await CityService.getAllCities(false);
    const similarCities = findSimilarCities(result.city, allCities, {
      limit: 6,
      minScore: 0.3,
    });

    console.log(
      `[Build] Successfully loaded city: ${result.city.name}, found ${similarCities.length} similar cities`
    );
    return {
      props: {
        city: result.city,
        similarCities,
        error: null,
      },
      revalidate: 3600, // Revalidate every hour for successful cases
    };
  } catch (error) {
    console.error('[Build] Error in city getStaticProps:', error);
    if (error instanceof Error) {
      console.error('[Build] Error stack:', error.stack);
      console.error('[Build] Error message:', error.message);
    }
    return {
      props: {
        error: 'An unexpected error occurred while loading the city data.',
      },
      revalidate: 60,
    };
  }
};
