/**
 * Cities Sitemap
 *
 * Generates XML sitemap for all city pages
 * Accessible at /sitemap-cities.xml
 */

import { GetServerSideProps } from 'next';
import { CityService } from '@/lib/services/cityService';
import {
  generateSitemap,
  generateCitySitemapUrls,
  splitSitemap,
} from '@/lib/seo/sitemap';

/**
 * This component never renders - we return XML directly
 */
export default function CitiesSitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    // Fetch all cities
    const cities = await CityService.getAllCities(false); // Get all cities without weather

    // Generate sitemap URLs
    const urls = generateCitySitemapUrls(cities);

    // Check if we need to split into multiple sitemaps
    const chunks = splitSitemap(urls);

    if (chunks.length > 1) {
      console.error(
        `[Sitemap] ERROR: Generated ${chunks.length} sitemap chunks (${urls.length} URLs). ` +
        `This exceeds the single sitemap limit. Please implement multi-file sitemap support.`
      );
      // Fail fast - don't serve partial data
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.write(
        `Error: Too many URLs (${urls.length}) for single sitemap. ` +
        `Maximum is 50,000. Please implement sitemap index.`
      );
      res.end();
      return { props: {} };
    }

    // Generate the sitemap XML
    const sitemap = generateSitemap(urls);

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
    console.error('[Sitemap] Error generating cities sitemap:', error);

    // Return a minimal sitemap on error
    const errorSitemap = generateSitemap([]);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(errorSitemap);
    res.end();

    return {
      props: {},
    };
  }
};
