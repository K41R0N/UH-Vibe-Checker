/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: []
  },
  webpack: (config, { isServer }) => {
    // Ensure JSON files are processed correctly
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });

    // Add source directory alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src')
    };

    return config;
  },
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  // Explicitly set TypeScript path aliases
  experimental: {
    esmExternals: 'loose'
  }
};

module.exports = nextConfig; 