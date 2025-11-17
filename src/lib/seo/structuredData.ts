/**
 * Structured Data (JSON-LD) Schema Generators
 *
 * This module generates Schema.org structured data for SEO enhancement.
 * All schemas follow Schema.org specifications for maximum compatibility.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

import type { City } from '@/types/city';
import { siteConfig } from '../config/site';

/**
 * Get site URL and name from config
 */
const SITE_URL = siteConfig.url;
const SITE_NAME = siteConfig.name;

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * FAQ item for FAQ sections
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * List item for ItemList schema
 */
export interface ListItem {
  name: string;
  url: string;
  description?: string;
  position: number;
}

/**
 * Generate Place schema for a city
 *
 * @see https://schema.org/Place
 * @see https://schema.org/City
 */
export function generatePlaceSchema(city: City) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${SITE_URL}/cities/${city.slug}#place`,
    name: city.name,
    description: city.description || `Discover ${city.name}, ${city.country} - Find cost of living, weather, and quality of life information.`,
    url: `${SITE_URL}/cities/${city.slug}`,
  };

  // Add address if country is available
  if (city.country) {
    schema.address = {
      '@type': 'PostalAddress',
      addressCountry: city.country,
      addressLocality: city.name,
    };
  }

  // Note: Coordinates, population, and image can be added in future
  // when these properties are added to the City type

  return schema;
}

/**
 * Generate BreadcrumbList schema for navigation
 *
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQPage schema for FAQ sections
 *
 * @see https://schema.org/FAQPage
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate ItemList schema for list pages (homepage, category pages)
 *
 * @see https://schema.org/ItemList
 */
export function generateItemListSchema(
  items: ListItem[],
  listName: string,
  listDescription?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: `${SITE_URL}${item.url}`,
      description: item.description,
    })),
  };
}

/**
 * Generate Organization schema for the site
 *
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add social media URLs here when available
    ],
  };
}

/**
 * Generate WebSite schema for the homepage
 *
 * @see https://schema.org/WebSite
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Discover cities around the world with comprehensive information on cost of living, weather, quality of life, and more.',
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate WebPage schema for individual pages
 *
 * @see https://schema.org/WebPage
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
  datePublished?: string,
  dateModified?: string
) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${url}#webpage`,
    name: title,
    description: description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      '@id': `${SITE_URL}#website`,
    },
    inLanguage: 'en-US',
  };

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  return schema;
}

/**
 * Generate complete structured data for a city page
 * Combines Place, BreadcrumbList, and WebPage schemas
 */
export function generateCityPageStructuredData(city: City) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Cities', url: '/cities' },
    { name: city.name, url: `/cities/${city.slug}` },
  ];

  const placeSchema = generatePlaceSchema(city);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const webPageSchema = generateWebPageSchema(
    `${city.name}, ${city.country} - Vibe Check`,
    city.description || `Discover ${city.name}, ${city.country}`,
    `/cities/${city.slug}`
  );

  // Return as a single graph for better entity relationship
  return {
    '@context': 'https://schema.org',
    '@graph': [placeSchema, breadcrumbSchema, webPageSchema],
  };
}

/**
 * Generate structured data for the homepage
 * Combines WebSite, Organization, and ItemList schemas
 */
export function generateHomepageStructuredData(cities: City[], totalCities: number) {
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();

  const listItems: ListItem[] = cities.map((city, index) => ({
    name: `${city.name}, ${city.country}`,
    url: `/cities/${city.slug}`,
    description: city.description,
    position: index + 1,
  }));

  const itemListSchema = generateItemListSchema(
    listItems,
    'Featured Cities',
    `Explore ${totalCities} cities around the world`
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, organizationSchema, itemListSchema],
  };
}

/**
 * Utility function to safely stringify structured data for HTML injection
 * Escapes special characters to prevent XSS
 */
export function stringifyStructuredData(schema: any): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Generate default FAQs for a city (can be customized per city later)
 */
export function generateDefaultCityFAQs(city: City): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      question: `What is the cost of living in ${city.name}?`,
      answer: `The cost of living in ${city.name}, ${city.country} varies depending on lifestyle and location within the city. Our data provides comprehensive information on housing, food, transportation, and utility costs to help you plan your budget.`,
    },
    {
      question: `What is the weather like in ${city.name}?`,
      answer: `${city.name} experiences ${city.weather?.condition || 'varied weather conditions'} throughout the year. Current temperature is around ${city.weather?.temperature || 'N/A'}°C. Check our detailed weather information for seasonal patterns and forecasts.`,
    },
    {
      question: `What can I find in ${city.name}?`,
      answer: `${city.name} offers ${city.description || 'a unique experience for visitors and residents alike'}. Discover comprehensive information about the city including quality of life metrics, local insights, and practical travel information.`,
    },
  ];

  return faqs;
}
