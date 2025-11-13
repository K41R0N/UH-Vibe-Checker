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
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD data is sanitized through stringifyStructuredData */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(structuredData),
          }}
        />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD data is sanitized through stringifyStructuredData */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyStructuredData(faqSchema),
          }}
        />
      </Head>

      {/* Hero / Header */}
      <Section padding="lg" background="cream">
        <div className="max-w-6xl">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <Badge className="mb-4">{city.country}</Badge>
              <h1 className="text-display-lg font-display font-bold mb-4">
                {city.name}
              </h1>
              <p className="text-body-xl text-black-600 leading-relaxed">
                {city.description}
              </p>
            </div>

            {/* Key Stats Card */}
            <div className="bg-white border-2 border-black p-6">
              <h2 className="text-heading-sm font-display font-bold mb-6">At a Glance</h2>
              <div className="space-y-4">
                {city.costOfLiving?.housing && (
                  <div className="flex items-center justify-between pb-3 border-b border-black-100">
                    <span className="text-body-sm text-black-600">Housing</span>
                    <span className="text-body-lg font-bold">${city.costOfLiving.housing}/mo</span>
                  </div>
                )}
                {city.weather && (
                  <div className="flex items-center justify-between pb-3 border-b border-black-100">
                    <span className="text-body-sm text-black-600">Temperature</span>
                    <span className="text-body-lg font-bold">{city.weather.temperature}°C</span>
                  </div>
                )}
                {city.qualityOfLife?.safety && (
                  <div className="flex items-center justify-between pb-3 border-b border-black-100">
                    <span className="text-body-sm text-black-600">Safety Score</span>
                    <span className="text-body-lg font-bold">{city.qualityOfLife.safety}/10</span>
                  </div>
                )}
                {city.qualityOfLife?.healthcare && (
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-black-600">Healthcare</span>
                    <span className="text-body-lg font-bold">{city.qualityOfLife.healthcare}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Cost of Living */}
      <Section padding="lg" background="white">
        <SectionHeader>
          <SectionTitle>Cost of Living Breakdown</SectionTitle>
          <p className="text-body-lg text-black-600 mt-4">
            Monthly expenses for a single person living in {city.name}
          </p>
        </SectionHeader>

        {city.costOfLiving ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost Breakdown Cards */}
            <div className="space-y-6">
              {[
                { label: 'Housing', value: city.costOfLiving.housing || 0, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', max: 3000 },
                { label: 'Food', value: city.costOfLiving.food || 0, icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', max: 1000 },
                { label: 'Transportation', value: city.costOfLiving.transportation || 0, icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', max: 500 },
                { label: 'Utilities', value: city.costOfLiving.utilities || 0, icon: 'M13 10V3L4 14h7v7l9-11h-7z', max: 300 },
              ].filter(item => item.value > 0).map((item, idx) => (
                <div key={idx} className="bg-cream-50 border border-black-100 p-6 hover:border-black-300 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <span className="text-body-md font-medium text-black-700">{item.label}</span>
                    </div>
                    <span className="text-heading-md font-display font-bold">${item.value}/mo</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="relative h-2 bg-black-100 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-black transition-all"
                      style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Card */}
            <div>
              <div className="bg-black text-white p-8 mb-6 sticky top-24">
                <h3 className="text-heading-lg font-display font-bold mb-6">Monthly Total</h3>
                <div className="text-display-lg font-display font-bold mb-8">
                  ${((city.costOfLiving.housing || 0) + (city.costOfLiving.food || 0) + (city.costOfLiving.transportation || 0) + (city.costOfLiving.utilities || 0)).toLocaleString()}
                </div>
                <div className="space-y-3 text-body-sm opacity-90">
                  {city.costOfLiving.housing && (
                    <div className="flex justify-between pb-2 border-b border-white/20">
                      <span>Housing</span>
                      <span className="font-medium">${city.costOfLiving.housing}</span>
                    </div>
                  )}
                  {city.costOfLiving.food && (
                    <div className="flex justify-between pb-2 border-b border-white/20">
                      <span>Food</span>
                      <span className="font-medium">${city.costOfLiving.food}</span>
                    </div>
                  )}
                  {city.costOfLiving.transportation && (
                    <div className="flex justify-between pb-2 border-b border-white/20">
                      <span>Transportation</span>
                      <span className="font-medium">${city.costOfLiving.transportation}</span>
                    </div>
                  )}
                  {city.costOfLiving.utilities && (
                    <div className="flex justify-between">
                      <span>Utilities</span>
                      <span className="font-medium">${city.costOfLiving.utilities}</span>
                    </div>
                  )}
                </div>
                <p className="text-body-xs opacity-75 mt-6 leading-relaxed">
                  * Estimates based on average costs for a single person. Actual expenses may vary based on lifestyle and location within the city.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataUnavailableMessage />
        )}
      </Section>

      {/* Quality of Life */}
      <Section padding="lg" background="cream">
        <SectionHeader>
          <SectionTitle>Quality of Life Metrics</SectionTitle>
          <p className="text-body-lg text-black-600 mt-4">
            Key indicators that shape daily life in {city.name}
          </p>
        </SectionHeader>

        {city.qualityOfLife ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Safety Score */}
            <div className="bg-white border-2 border-black p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-heading-sm font-display font-bold">Safety</h3>
              </div>
              <div className="text-display-md font-display font-bold mb-4">
                {city.qualityOfLife.safety}/10
              </div>
              {/* Visual Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 ${i < city.qualityOfLife.safety ? 'bg-black' : 'bg-black-100'}`}
                  />
                ))}
              </div>
              <p className="text-body-sm text-black-600">
                {city.qualityOfLife.safety >= 8 ? 'Excellent safety record' :
                 city.qualityOfLife.safety >= 6 ? 'Good overall safety' :
                 city.qualityOfLife.safety >= 4 ? 'Moderate safety levels' :
                 'Exercise caution'}
              </p>
            </div>

            {/* Healthcare Score */}
            <div className="bg-white border-2 border-black p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-heading-sm font-display font-bold">Healthcare</h3>
              </div>
              <div className="text-display-md font-display font-bold mb-4">
                {city.qualityOfLife.healthcare}/10
              </div>
              {/* Visual Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 ${i < city.qualityOfLife.healthcare ? 'bg-black' : 'bg-black-100'}`}
                  />
                ))}
              </div>
              <p className="text-body-sm text-black-600">
                {city.qualityOfLife.healthcare >= 8 ? 'World-class healthcare' :
                 city.qualityOfLife.healthcare >= 6 ? 'Quality medical care' :
                 city.qualityOfLife.healthcare >= 4 ? 'Adequate healthcare' :
                 'Basic medical services'}
              </p>
            </div>

            {/* Climate */}
            <div className="bg-white border-2 border-black p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-black text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-heading-sm font-display font-bold">Climate</h3>
              </div>
              <div className="text-heading-lg font-display font-bold mb-6">
                {city.qualityOfLife.climate}
              </div>
              {city.weather && (
                <div className="space-y-3 text-body-sm">
                  <div className="flex justify-between pb-2 border-b border-black-100">
                    <span className="text-black-600">Current Temp</span>
                    <span className="font-medium">{city.weather.temperature}°C</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-black-100">
                    <span className="text-black-600">Condition</span>
                    <span className="font-medium">{city.weather.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black-600">Humidity</span>
                    <span className="font-medium">{city.weather.humidity}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <DataUnavailableMessage />
        )}
      </Section>

      {/* Additional Information */}
      {city.wikiData && (
        <>
          {city.wikiData.overview && (
            <Section padding="lg" background="white">
              <SectionHeader>
                <SectionTitle>About {city.name}</SectionTitle>
              </SectionHeader>
              <div className="max-w-4xl">
                <p className="text-body-xl text-black-700 leading-relaxed">{city.wikiData.overview}</p>
              </div>
            </Section>
          )}

          {city.wikiData.gettingAround && (
            <Section padding="lg" background="cream">
              <SectionHeader>
                <SectionTitle>Getting Around</SectionTitle>
                <p className="text-body-lg text-black-600 mt-4">
                  Transportation options in {city.name}
                </p>
              </SectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {city.wikiData.gettingAround.byPublicTransport && (
                  <div className="bg-white border border-black-200 p-6 hover:border-black-400 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cream-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <h3 className="text-heading-sm font-display font-bold">Public Transport</h3>
                    </div>
                    <p className="text-body-md text-black-600 leading-relaxed">{city.wikiData.gettingAround.byPublicTransport}</p>
                  </div>
                )}
                {city.wikiData.gettingAround.byTaxi && (
                  <div className="bg-white border border-black-200 p-6 hover:border-black-400 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cream-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                      <h3 className="text-heading-sm font-display font-bold">Taxis & Rideshare</h3>
                    </div>
                    <p className="text-body-md text-black-600 leading-relaxed">{city.wikiData.gettingAround.byTaxi}</p>
                  </div>
                )}
                {city.wikiData.gettingAround.byBike && (
                  <div className="bg-white border border-black-200 p-6 hover:border-black-400 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cream-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-heading-sm font-display font-bold">Cycling</h3>
                    </div>
                    <p className="text-body-md text-black-600 leading-relaxed">{city.wikiData.gettingAround.byBike}</p>
                  </div>
                )}
                {city.wikiData.gettingAround.walking && (
                  <div className="bg-white border border-black-200 p-6 hover:border-black-400 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-cream-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-heading-sm font-display font-bold">Walking</h3>
                    </div>
                    <p className="text-body-md text-black-600 leading-relaxed">{city.wikiData.gettingAround.walking}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {city.wikiData.practicalInfo && (
            <Section padding="lg" background="white">
              <SectionHeader>
                <SectionTitle>Practical Information</SectionTitle>
                <p className="text-body-lg text-black-600 mt-4">
                  Essential details for planning your visit or move to {city.name}
                </p>
              </SectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {city.wikiData.practicalInfo.visaRequirements && (
                  <div className="bg-cream-50 border-2 border-black-100 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-body-sm font-medium text-black-500 uppercase tracking-wide">Visa Requirements</span>
                    </div>
                    <p className="text-body-lg font-medium text-black">{city.wikiData.practicalInfo.visaRequirements}</p>
                  </div>
                )}
                {city.wikiData.practicalInfo.language && (
                  <div className="bg-cream-50 border-2 border-black-100 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span className="text-body-sm font-medium text-black-500 uppercase tracking-wide">Language</span>
                    </div>
                    <p className="text-body-lg font-medium text-black">{city.wikiData.practicalInfo.language}</p>
                  </div>
                )}
                {city.wikiData.practicalInfo.currency && (
                  <div className="bg-cream-50 border-2 border-black-100 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-black-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-body-sm font-medium text-black-500 uppercase tracking-wide">Currency</span>
                    </div>
                    <p className="text-body-lg font-medium text-black">{city.wikiData.practicalInfo.currency}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {city.wikiData.seasonalInfo?.bestTimeToVisit && (
            <Section padding="lg" background="cream">
              <SectionHeader>
                <SectionTitle>Best Time to Visit</SectionTitle>
              </SectionHeader>
              <div className="bg-white border-2 border-black p-8 max-w-4xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream-100 flex-shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-body-xl text-black-700 leading-relaxed">
                      {city.wikiData.seasonalInfo.bestTimeToVisit}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          )}
        </>
      )}

      {/* Similar Cities Section */}
      {similarCities && similarCities.length > 0 && (
        <Section padding="lg" background="white">
          <SectionHeader>
            <SectionTitle>Similar Destinations</SectionTitle>
            <p className="text-body-lg text-black-600 mt-4">
              Explore cities with similar characteristics to {city.name}
            </p>
          </SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCities.map((similar) => (
              <Card key={similar.city.slug} href={`/cities/${similar.city.slug}`} className="group hover:shadow-lg transition-all">
                {/* City Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="group-hover:text-black-700 transition-colors flex-1">
                      {similar.city.name}
                    </CardTitle>
                    {similar.score && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {Math.round(similar.score * 100)}% match
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-sm text-black-500 uppercase tracking-wide">
                    {similar.city.country}
                  </p>
                </div>

                {/* Similarity Reasons */}
                {similar.reasons.length > 0 && (
                  <div className="bg-cream-50 border border-black-100 p-4 mb-4">
                    <p className="text-body-xs font-medium text-black-500 uppercase tracking-wide mb-3">
                      Why it's similar
                    </p>
                    <div className="space-y-2">
                      {similar.reasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-body-sm text-black-700">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-black-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Stats */}
                {similar.city.costOfLiving?.housing && (
                  <div className="flex items-center justify-between text-body-sm mb-4 pb-4 border-b border-black-100">
                    <span className="text-black-500">Housing</span>
                    <span className="font-medium">${similar.city.costOfLiving.housing}/mo</span>
                  </div>
                )}

                {/* View Details Link */}
                <div className="flex items-center text-body-sm font-medium group-hover:translate-x-2 transition-transform">
                  <span>Compare Cities</span>
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
