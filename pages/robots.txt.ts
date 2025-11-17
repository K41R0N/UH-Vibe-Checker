/**
 * Dynamic robots.txt
 * Adapts to any deployment domain
 */

import type { GetServerSideProps } from 'next';
import { siteConfig } from '@/lib/config/site';

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { url } = siteConfig;

  const robotsTxt = `# Robots.txt for ${siteConfig.name}
# Dynamically generated for ${url}

# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${url}/sitemap.xml

# Crawl-delay (optional)
# Crawl-delay: 1

# Disallow specific paths (if any)
# Disallow: /api/
# Disallow: /admin/
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=172800');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};
