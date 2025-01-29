import Link from 'next/link'
import { getCities } from '../src/lib/cities'
import { City } from '../src/types/city'

interface HomeProps {
  cities: City[]
}

export default function Home({ cities }: HomeProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">City Guides</h1>
      <div className="grid gap-4">
        {cities.map(city => (
          <Link 
            key={city.id} 
            href={`/cities/${city.slug}`}
            className="p-4 bg-gray-100 rounded hover:bg-gray-200"
          >
            <h2 className="text-xl font-semibold">{city.name}, {city.country}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const cities = await getCities()
  return {
    props: {
      cities
    }
  }
} 