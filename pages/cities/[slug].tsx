import { GetStaticPaths, GetStaticProps } from 'next';
import { City } from '@/types/city';
import { CityService } from '@/lib/services/cityService';
import Head from 'next/head';

interface CityPageProps {
  city: City;
}

const DataUnavailableMessage = () => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
    <p className="font-medium">Temporarily Unavailable</p>
    <p className="text-sm">We're having trouble fetching this data. Please check back later.</p>
  </div>
);

export default function CityPage({ city }: CityPageProps) {
  return (
    <>
      <Head>
        <title>{city.metadata.title}</title>
        <meta name="description" content={city.metadata.description} />
      </Head>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">{city.name}, {city.country}</h1>
        
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
    const paths = await CityService.generateStaticPaths();
    return {
      paths,
      fallback: 'blocking' // This allows for ISR (Incremental Static Regeneration)
    };
  } catch (error) {
    console.error('Error generating paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps<CityPageProps> = async (context) => {
  try {
    const slug = context.params?.slug as string;
    const cityData = await CityService.getCityBySlug(slug);

    if (!cityData) {
      return { notFound: true };
    }

    return {
      props: { city: cityData },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching city data:', error);
    return { notFound: true };
  }
}; 