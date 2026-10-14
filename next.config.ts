import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/features/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // 75 is the default; 90 keeps text legible in case study screenshots (WorkMedia).
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
