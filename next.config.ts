import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: 'http://localhost:3000/api/v1/:path*',
  //     },
  //   ];
  // },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    dangerouslyAllowSVG: true,
    // path: 'https://randomuser.me',
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   port: '',
      //   hostname: 'github.com',
      // },
      {
        protocol: 'https',
        port: '',
        hostname: 'randomuser.me',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // 개발 모드가 아닐 때만 Storybook 파일들을 제외
    if (!dev) {
      // Storybook 관련 파일들을 무시
      config.module.rules.unshift(
        {
          test: /\.stories\.[jt]sx?$/,
          use: 'ignore-loader',
        },
        {
          test: /\.(stories|story)\.[jt]sx?$/,
          use: 'ignore-loader',
        },
      );
    }

    // SVG 처리 (항상 적용)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
