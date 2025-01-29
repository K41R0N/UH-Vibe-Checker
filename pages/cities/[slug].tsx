import { GetStaticPaths, GetStaticProps } from 'next';
import { City } from '../../src/types/city';
import { getCityBySlug, generateStaticPaths } from '../../src/lib/cities';
import Head from 'next/head';
import { generateMetaTags } from '../../src/lib/seo';

interface CityPageProps {
  city: City;
}

export default function CityPage({ city }: CityPageProps) {
  const metaTags = generateMetaTags(city);
  
  return (
    <>
      <Head>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Head>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">{city.name}, {city.country}</h1>
        
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

export const getStaticProps: GetStaticProps<CityPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const city = await getCityBySlug(slug);
  
  if (!city) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      city
    }
  };
}; 