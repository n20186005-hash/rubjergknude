import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host' as const, value: 'rubjergknude.com' }],
        destination: 'https://www.rubjergknude.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
