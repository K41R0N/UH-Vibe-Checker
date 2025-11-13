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
    // (we probably won't with 370 cities, but this is future-proof)
    const chunks = splitSitemap(urls);

    if (chunks.length > 1) {
      console.warn(
        `[Sitemap] Generated ${chunks.length} sitemap chunks. Consider creating separate sitemap files.`
      );
    }

    // Generate the sitemap XML (use first chunk if split)
    const sitemap = generateSitemap(chunks[0] || urls);

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
