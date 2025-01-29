import { GetStaticPaths, GetStaticProps } from 'next';
import { City, CityData } from '@/types/city';
import { getCityBySlug, generateStaticPaths } from '@/lib/cities';
import Head from 'next/head';

interface CityPageProps {
  city: City;
}

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

        {city.costOfLiving && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cost of Living</h2>
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
          </section>
        )}

        {city.qualityOfLife && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quality of Life</h2>
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
          </section>
        )}

        {city.weather && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
            <div className="p-4 bg-gray-100 rounded">
              <p className="font-medium">{city.weather.condition}</p>
              <p className="text-xl">{city.weather.temperature}°C</p>
              <p>Humidity: {city.weather.humidity}%</p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await generateStaticPaths();
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<CityPageProps> = async (context) => {
  const slug = context.params?.slug as string;
  const cityData = await getCityBySlug(slug);

  if (!cityData) {
    return { notFound: true };
  }

  // Transform CityData to City by adding metadata
  const city: City = {
    ...cityData,
    metadata: {
      title: `Living in ${cityData.name} - City Guide`,
      description: `Complete guide to living in ${cityData.name}, ${cityData.country}. Explore cost of living, quality of life, and more.`,
      keywords: [cityData.name.toLowerCase(), cityData.country.toLowerCase(), 'cost of living', 'expat']
    }
  };

  return {
    props: { city },
    revalidate: 3600 // Revalidate every hour
  };
}; 