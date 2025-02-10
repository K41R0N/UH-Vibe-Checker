import { GetStaticPaths, GetStaticProps } from 'next';
import { getCityBySlug, getCities } from '@/lib/services/cityService';
import type { CityData } from '@/types/city';
import CityDetails from '@/components/CityDetails';
import Head from 'next/head';
import Link from 'next/link';

interface CityPageProps {
  cityData: CityData;
  error?: string | null;
}

const DataUnavailableMessage = () => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
    <p className="font-medium">Temporarily Unavailable</p>
    <p className="text-sm">We're having trouble fetching this data. Please check back later.</p>
  </div>
);

export default function CityPage({ cityData, error }: CityPageProps) {
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

  if (!cityData || !cityData.metadata) {
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
        <title>{cityData.metadata.title}</title>
        <meta name="description" content={cityData.metadata.description} />
      </Head>
      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">{cityData.name}, {cityData.country}</h1>
          <Link
            href="/"
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Cities
          </Link>
        </div>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg italic">{cityData.description}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cost of Living</h2>
          {cityData.costOfLiving ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Housing</p>
                <p className="text-xl">${cityData.costOfLiving.housing}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Food</p>
                <p className="text-xl">${cityData.costOfLiving.food}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Transportation</p>
                <p className="text-xl">${cityData.costOfLiving.transportation}/month</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Utilities</p>
                <p className="text-xl">${cityData.costOfLiving.utilities}/month</p>
              </div>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality of Life</h2>
          {cityData.qualityOfLife ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Safety Score</p>
                <p className="text-xl">{cityData.qualityOfLife.safety}/10</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Healthcare</p>
                <p className="text-xl">{cityData.qualityOfLife.healthcare}/10</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="font-medium">Climate</p>
                <p className="text-xl">{cityData.qualityOfLife.climate}</p>
              </div>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
          {cityData.weather ? (
            <div className="p-4 bg-gray-100 rounded">
              <p className="font-medium">{cityData.weather.condition}</p>
              <p className="text-xl">{cityData.weather.temperature}°C</p>
              <p>Humidity: {cityData.weather.humidity}%</p>
            </div>
          ) : <DataUnavailableMessage />}
        </section>

        {cityData.wikiData && (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              {cityData.wikiData.overview ? (
                <div className="p-4 bg-gray-100 rounded">
                  <p>{cityData.wikiData.overview}</p>
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Getting Around</h2>
              {cityData.wikiData.gettingAround ? (
                <div className="grid gap-4">
                  {cityData.wikiData.gettingAround.byPublicTransport && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Public Transport</p>
                      <p>{cityData.wikiData.gettingAround.byPublicTransport}</p>
                    </div>
                  )}
                  {cityData.wikiData.gettingAround.byTaxi && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Taxis</p>
                      <p>{cityData.wikiData.gettingAround.byTaxi}</p>
                    </div>
                  )}
                  {cityData.wikiData.gettingAround.byBike && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Cycling</p>
                      <p>{cityData.wikiData.gettingAround.byBike}</p>
                    </div>
                  )}
                  {cityData.wikiData.gettingAround.walking && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Walking</p>
                      <p>{cityData.wikiData.gettingAround.walking}</p>
                    </div>
                  )}
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Practical Information</h2>
              {cityData.wikiData.practicalInfo ? (
                <div className="grid gap-4">
                  {cityData.wikiData.practicalInfo.visaRequirements && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Visa Requirements</p>
                      <p>{cityData.wikiData.practicalInfo.visaRequirements}</p>
                    </div>
                  )}
                  {cityData.wikiData.practicalInfo.language && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Language</p>
                      <p>{cityData.wikiData.practicalInfo.language}</p>
                    </div>
                  )}
                  {cityData.wikiData.practicalInfo.currency && (
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-medium">Currency</p>
                      <p>{cityData.wikiData.practicalInfo.currency}</p>
                    </div>
                  )}
                </div>
              ) : <DataUnavailableMessage />}
            </section>

            {cityData.wikiData.seasonalInfo && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Best Time to Visit</h2>
                {cityData.wikiData.seasonalInfo.bestTimeToVisit ? (
                  <div className="p-4 bg-gray-100 rounded">
                    <p>{cityData.wikiData.seasonalInfo.bestTimeToVisit}</p>
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
  const cities = getCities();
  
  const paths = cities.map((city) => ({
    params: { slug: city.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const cityData = await getCityBySlug(slug);

  if (!cityData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cityData,
    },
    revalidate: 3600, // Revalidate every hour
  };
}; 