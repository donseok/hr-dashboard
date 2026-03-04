/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@hr-dashboard/design-tokens',
    '@hr-dashboard/shared-types',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    return config;
  },
};

module.exports = nextConfig;
