/**
 * Site Configuration
 *
 * Central configuration for site-wide settings, domain, and metadata.
 * This makes the site adaptable to different domains and programmatic use cases.
 */

/**
 * Get the site URL from environment or fallback to default
 * Priority: NEXT_PUBLIC_SITE_URL > NEXT_PUBLIC_VERCEL_URL > localhost
 */
export function getSiteUrl(): string {
  // Production site URL from environment
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Vercel auto-deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Netlify URL
  if (process.env.URL) {
    return process.env.URL;
  }

  // Development fallback
  return 'http://localhost:3000';
}

/**
 * Site configuration
 */
export const siteConfig = {
  // Dynamic site URL
  url: getSiteUrl(),

  // Site metadata
  name: 'Vibe Checker',
  title: 'Vibe Checker — Discover Your Perfect City',
  description:
    'Explore comprehensive city guides for digital nomads and travelers. Compare cost of living, quality of life, and local insights for destinations worldwide.',

  // Social/OG metadata
  ogImage: '/og-image.png',
  twitterHandle: '@vibechecker',

  // Site structure for programmatic SEO
  structure: {
    // Entity type (can be 'cities', 'products', 'recipes', etc.)
    entityType: 'cities',

    // Entity path prefix
    entityPath: '/cities',

    // Sitemap configuration
    sitemap: {
      // Maximum URLs per sitemap file
      maxUrlsPerFile: 50000,

      // Default change frequency
      defaultChangeFreq: 'weekly' as const,

      // Default priority by page type
      priorities: {
        homepage: 1.0,
        entity: 0.8,
        comparison: 0.7,
        taxonomy: 0.6,
        static: 0.5,
      },
    },
  },

  // Feature flags
  features: {
    // Enable weather data
    weather: true,

    // Enable internal linking
    similarEntities: true,

    // Enable comparisons
    comparisons: false,

    // Enable taxonomy pages
    taxonomy: false,
  },
} as const;

/**
 * Get absolute URL for a path
 */
export function getAbsoluteUrl(path: string): string {
  const url = siteConfig.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${url}${cleanPath}`;
}

/**
 * Get entity URL (e.g., /cities/london)
 */
export function getEntityUrl(slug: string): string {
  return `${siteConfig.structure.entityPath}/${slug}`;
}

/**
 * Get comparison URL (e.g., /compare/london-vs-paris)
 */
export function getComparisonUrl(slug1: string, slug2: string): string {
  return `/compare/${slug1}-vs-${slug2}`;
}

/**
 * Get taxonomy URL (e.g., /best-cities or /cheapest-cities)
 */
export function getTaxonomyUrl(taxonomy: string): string {
  return `/${taxonomy}`;
}
