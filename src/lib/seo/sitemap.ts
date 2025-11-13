/**
 * Sitemap Generation Utilities
 *
 * This module generates XML sitemaps for SEO.
 * Supports sitemap index and multiple sitemap files.
 *
 * @see https://www.sitemaps.org/protocol.html
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 */

import type { City } from '@/types/city';

/**
 * Base URL for the site
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibe-checker.netlify.app';

/**
 * Sitemap URL entry
 */
export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Sitemap index entry
 */
export interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url: SitemapURL): string {
  let xml = '  <url>\n';
  xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;

  if (url.lastmod) {
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
  }

  if (url.changefreq) {
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
  }

  if (url.priority !== undefined) {
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
  }

  xml += '  </url>\n';
  return xml;
}

/**
 * Generate a complete sitemap XML document
 */
export function generateSitemap(urls: SitemapURL[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    xml += generateUrlEntry(url);
  }

  xml += '</urlset>';
  return xml;
}

/**
 * Generate a sitemap index XML document
 */
export function generateSitemapIndex(sitemaps: SitemapIndexEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const sitemap of sitemaps) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${escapeXml(sitemap.loc)}</loc>\n`;
    if (sitemap.lastmod) {
      xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    }
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>';
  return xml;
}

/**
 * Generate sitemap URLs for city pages
 */
export function generateCitySitemapUrls(cities: City[]): SitemapURL[] {
  const now = new Date().toISOString();

  return cities.map((city) => ({
    loc: `${SITE_URL}/cities/${city.slug}`,
    lastmod: now,
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));
}

/**
 * Generate sitemap URLs for static pages
 */
export function generateStaticSitemapUrls(): SitemapURL[] {
  const now = new Date().toISOString();

  return [
    {
      loc: SITE_URL,
      lastmod: now,
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    // Add more static pages here as they're created
    // {
    //   loc: `${SITE_URL}/about`,
    //   lastmod: now,
    //   changefreq: 'monthly',
    //   priority: 0.5,
    // },
  ];
}

/**
 * Split URLs into multiple sitemaps if needed
 * (Google recommends max 50,000 URLs per sitemap)
 */
export function splitSitemap(urls: SitemapURL[], maxPerSitemap = 50000): SitemapURL[][] {
  const chunks: SitemapURL[][] = [];

  for (let i = 0; i < urls.length; i += maxPerSitemap) {
    chunks.push(urls.slice(i, i + maxPerSitemap));
  }

  return chunks;
}

/**
 * Get the current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}
