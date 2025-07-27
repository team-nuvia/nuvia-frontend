import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    dangerouslyAllowSVG: true,
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     port: '',
    //     hostname: 'github.com',
    //   },
    //   {
    //     protocol: 'https',
    //     port: '',
    //     hostname: 'raw.githubusercontent.com',
    //   },
    // ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  
};

export default nextConfig;
