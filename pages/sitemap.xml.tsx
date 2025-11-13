/**
 * Main Sitemap Index
 *
 * Generates the main sitemap index that references all individual sitemaps
 * Accessible at /sitemap.xml
 */

import { GetServerSideProps } from 'next';
import {
  generateSitemap,
  generateStaticSitemapUrls,
} from '@/lib/seo/sitemap';

/**
 * This component never renders - we return XML directly
 */
export default function SitemapIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // For now, we'll include both the static pages and cities in one sitemap
    // Later, when we have more pages (comparisons, taxonomies), we can split them
    // into separate sitemap files and create a sitemap index

    // Get static pages URLs
    const staticUrls = generateStaticSitemapUrls();

    // Import cities service and get all cities
    const { CityService } = await import('@/lib/services/cityService');
    const { generateCitySitemapUrls } = await import('@/lib/seo/sitemap');

    const cities = await CityService.getAllCities(false); // Get all cities without weather
    const cityUrls = generateCitySitemapUrls(cities);

    // Combine all URLs
    const allUrls = [...staticUrls, ...cityUrls];

    // Generate complete sitemap
    const sitemap = generateSitemap(allUrls);

    // Set headers for XML response
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=7200'
    );

    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap index:', error);

    // Return a minimal sitemap on error
    const { generateSitemap } = await import('@/lib/seo/sitemap');
    const errorSitemap = generateSitemap([]);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(errorSitemap);
    res.end();

    return {
      props: {},
    };
  }
};
