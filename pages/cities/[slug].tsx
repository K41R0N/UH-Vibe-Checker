import { GetStaticPaths, GetStaticProps } from 'next';
import { City } from '@/types/city';
import { CityService } from '@/lib/services/cityService';
import Head from 'next/head';
import Link from 'next/link';

interface CityPageProps {
  city?: City;
  error?: string | null;
}

const DataUnavailableMessage = () => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
    <p className="font-medium">Temporarily Unavailable</p>
    <p className="text-sm">We're having trouble fetching this data. Please check back later.</p>
  </div>
);

export default function CityPage({ city, error }: CityPageProps) {
  if (error) {
    return (
      <>
        <Head>
          <title>Error Loading City - Vibe Checker</title>
          <meta name="description" content="There was an error loading the city data." />
        </Head>
        <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-xl text-gray-600 mb-8">{error}</p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </main>
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
        <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Loading City Data</h1>
            <p className="text-xl text-gray-600 mb-8">Please wait while we fetch the city information...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{city.metadata.title}</title>
        <meta name="description" content={city.metadata.description} />
        <meta name="keywords" content={city.metadata.keywords.join(', ')} />
        <meta property="og:title" content={city.metadata.title} />
        <meta property="og:description" content={city.metadata.description} />
        <link rel="canonical" href={`https://uh-vibe-checker.netlify.app/cities/${city.slug}`} />
      </Head>
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{city.name}, {city.country}</h1>
          <Link
            href="/"
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Cities
          </Link>
        </div>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg italic">{city.description}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cost of Living</h2>
          {city.costOfLiving ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Housing</p>
                <p className="text-xl">${city.costOfLiving.housing}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Food</p>
                <p className="text-xl">${city.costOfLiving.food}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Transportation</p>
                <p className="text-xl">${city.costOfLiving.transportation}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Utilities</p>
                <p className="text-xl">${city.costOfLiving.utilities}/month</p>
              </div>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality of Life</h2>
          {city.qualityOfLife ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Safety Score</p>
                <p className="text-xl">{city.qualityOfLife.safety}/10</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Healthcare</p>
                <p className="text-xl">{city.qualityOfLife.healthcare}/10</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Climate</p>
                <p className="text-xl">{city.qualityOfLife.climate}</p>
              </div>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
          {city.weather ? (
            <div className="p-4 bg-gray-100 rounded">
              <p className="font-medium">{city.weather.condition}</p>
              <p className="text-xl">{city.weather.temperature}°C</p>
              <p>Humidity: {city.weather.humidity}%</p>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        {city.wikiData && (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              {city.wikiData.overview ? (
                <div className="p-4 bg-gray-100 rounded">
                  <p>{city.wikiData.overview}</p>
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Getting Around</h2>
              {city.wikiData.gettingAround ? (
                <div className="grid gap-4">
                  {city.wikiData.gettingAround.byPublicTransport && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Public Transport</p>
                      <p>{city.wikiData.gettingAround.byPublicTransport}</p>
                    </div>
                  )}
                  {city.wikiData.gettingAround.byTaxi && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Taxis</p>
                      <p>{city.wikiData.gettingAround.byTaxi}</p>
                    </div>
                  )}
                  {city.wikiData.gettingAround.byBike && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Cycling</p>
                      <p>{city.wikiData.gettingAround.byBike}</p>
                    </div>
                  )}
                  {city.wikiData.gettingAround.walking && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Walking</p>
                      <p>{city.wikiData.gettingAround.walking}</p>
                    </div>
                  )}
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Practical Information</h2>
              {city.wikiData.practicalInfo ? (
                <div className="grid gap-4">
                  {city.wikiData.practicalInfo.visaRequirements && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Visa Requirements</p>
                      <p>{city.wikiData.practicalInfo.visaRequirements}</p>
                    </div>
                  )}
                  {city.wikiData.practicalInfo.language && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Language</p>
                      <p>{city.wikiData.practicalInfo.language}</p>
                    </div>
                  )}
                  {city.wikiData.practicalInfo.currency && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Currency</p>
                      <p>{city.wikiData.practicalInfo.currency}</p>
                    </div>
                  )}
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            {city.wikiData.seasonalInfo && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Best Time to Visit</h2>
                {city.wikiData.seasonalInfo.bestTimeToVisit ? (
                  <div className="p-4 bg-gray-100 rounded">
                    <p>{city.wikiData.seasonalInfo.bestTimeToVisit}</p>
                  </div>
                ) : <DataUnavailableMessage />}
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    console.log('[Build] Starting getStaticPaths for city pages...')
    const paths = await CityService.generateStaticPaths();
    console.log(`[Build] Generated ${paths.length} city paths`)
    return {
      paths,
      fallback: true // Allow ISR for new paths
    };
  } catch (error) {
    console.error('[Build] Error in getStaticPaths:', error);
    if (error instanceof Error) {
      console.error('[Build] Error stack:', error.stack)
      console.error('[Build] Error message:', error.message)
    }
    return {
      paths: [],
      fallback: true
    };
  }
};

export const getStaticProps: GetStaticProps<CityPageProps> = async (context) => {
  try {
    const slug = context.params?.slug as string;
    console.log(`[Build] Getting city data for slug: ${slug}`)
    const result = await CityService.getCityBySlug(slug);

    if (!result.city) {
      // If we have an error message, we'll show it on a custom error page
      if (result.error) {
        console.log(`[Build] City not found or error: ${result.error}`)
        return {
          props: {
            error: result.error
          },
          revalidate: 60 // Try again sooner for error cases
        };
      }
      // If no error message, use 404
      console.log(`[Build] City ${slug} not found, returning 404`)
      return { notFound: true };
    }

    console.log(`[Build] Successfully loaded city: ${result.city.name}`)
    return {
      props: {
        city: result.city,
        error: null
      },
      revalidate: 3600 // Revalidate every hour for successful cases
    };
  } catch (error) {
    console.error('[Build] Error in city getStaticProps:', error);
    if (error instanceof Error) {
      console.error('[Build] Error stack:', error.stack)
      console.error('[Build] Error message:', error.message)
    }
    return {
      props: {
        error: 'An unexpected error occurred while loading the city data.'
      },
      revalidate: 60
    };
  }
}; 