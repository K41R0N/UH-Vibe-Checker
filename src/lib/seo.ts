import { City } from '@/types/city';

export const generateMetaTags = (city: City) => {
  return {
    title: `${city.name} Cost of Living and City Guide | Urban Hideout`,
    description: `Discover ${city.name}'s cost of living, quality of life, and everything you need to know about moving to this amazing city. Compare prices, lifestyle, and more.`,
    openGraph: {
      title: `Living in ${city.name} - Complete City Guide`,
      description: `Comprehensive guide about living in ${city.name}. Compare costs, lifestyle, and get practical moving advice.`,
      images: [
        {
          url: `https://yourdomain.com/images/cities/${city.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${city.name} cityscape`,
        },
      ],
    },
    canonical: `https://yourdomain.com/cities/${city.slug}`,
  };
}; 