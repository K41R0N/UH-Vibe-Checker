import { useState } from 'react'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { City } from '@/types/city'
import { CityService } from '@/lib/services/cityService'
import Head from 'next/head'

interface HomeProps {
  initialCities: City[]
  totalCities: number
}

const ITEMS_PER_PAGE = 20

const WeatherDisplay = ({ weather }: { weather: City['weather'] }) => {
  if (!weather) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        Weather data temporarily unavailable
      </div>
    )
  }

  return (
    <div className="mt-4 text-sm text-gray-500">
      Currently: {weather.temperature}°C, {weather.condition}
    </div>
  )
}

export default function Home({ initialCities, totalCities }: HomeProps) {
  const [cities, setCities] = useState<City[]>(initialCities)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const loadMore = async () => {
    try {
      setLoading(true)
      const nextPage = currentPage + 1
      const result = await fetch(`/api/cities?page=${nextPage}`)
      const data = await result.json()
      
      if (data.cities) {
        setCities(prev => [...prev, ...data.cities])
        setCurrentPage(nextPage)
      }
    } catch (error) {
      console.error('Error loading more cities:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Vibe Checker - Digital Nomad City Guides</title>
        <meta
          name="description"
          content="Explore comprehensive city guides for digital nomads. Compare cost of living, quality of life, and local insights for popular destinations worldwide."
        />
      </Head>
      
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Vibe Checker</h1>
        <p className="text-xl mb-8">Discover your next destination</p>
        
        {cities.length === 0 ? (
          <p className="text-gray-600 text-center">No cities available at the moment. Please check back later.</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {cities.map((city) => (
                <Link 
                  href={`/cities/${city.slug}`} 
                  key={city.id || `${city.name}-${city.country}`.toLowerCase()}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-2xl font-semibold mb-2">
                    {city.name}, {city.country}
                  </h2>
                  <p className="text-gray-600 mb-4">{city.description}</p>
                  <WeatherDisplay weather={city.weather} />
                </Link>
              ))}
            </div>

            {cities.length < totalCities && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Loading...' : 'Load More Cities'}
                </button>
              </div>
            )}

            {cities.length >= totalCities && (
              <p className="text-center text-gray-600 mt-8">
                You've viewed all available cities
              </p>
            )}
          </>
        )}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const { cities, total } = await CityService.getCities(1, false) // Don't load weather for initial page
    
    return {
      props: {
        initialCities: cities,
        totalCities: total
      },
      revalidate: 3600 // Revalidate every hour
    }
  } catch (error) {
    console.error('Error fetching cities:', error)
    return {
      props: {
        initialCities: [],
        totalCities: 0
      },
      revalidate: 60 // Retry sooner if there was an error
    }
  }
} 