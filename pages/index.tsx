import Link from 'next/link'
import { GetStaticProps } from 'next'
import { City } from '@/types/city'
import { getCities } from '@/lib/cities'
import Head from 'next/head'

interface HomeProps {
  cities: City[]
}

export default function Home({ cities }: HomeProps) {
  return (
    <>
      <Head>
        <title>Vibe Checker - Digital Nomad City Guides</title>
        <meta name="description" content="Explore comprehensive city guides for digital nomads. Compare cost of living, quality of life, and local insights for popular destinations worldwide." />
      </Head>
      
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Vibe Checker</h1>
        <p className="text-xl mb-8">Discover your next destination</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {cities.map((city) => (
            <Link 
              href={`/cities/${city.slug}`} 
              key={city.id}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {city.name}, {city.country}
              </h2>
              <p className="text-gray-600 mb-4">{city.description}</p>
              {city.weather && (
                <div className="mt-4 text-sm text-gray-500">
                  Currently: {city.weather.temperature}°C, {city.weather.condition}
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const cities = await getCities()
  
  return {
    props: {
      cities
    },
    revalidate: 3600 // Revalidate every hour
  }
} 