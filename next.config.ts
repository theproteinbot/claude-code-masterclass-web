import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repo = 'claude-code-masterclass-web';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  trailingSlash: true,
};

export default nextConfig;
