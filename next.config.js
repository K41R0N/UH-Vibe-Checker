/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [],
    unoptimized: true
  },
  // Enable static exports for Netlify
  trailingSlash: true,
  // Ensure our JSON data is available
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure our city data is included in the build
      config.module.rules.push({
        test: /cities\.json$/,
        type: 'asset/resource'
      });
    }
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  },
  // Add custom headers to suppress favicon 404s in development
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  }
};

module.exports = nextConfig; 