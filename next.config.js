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
    return config;
  }
};

module.exports = nextConfig; 