import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Experimental features
  experimental: {
    esmExternals: true,
  },

  // Image Optimization - Allow remote images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.easykoro.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
    // Reduce image sizes for faster load
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Enable gzip compression
  compress: true,

  // Reduce bundle size in production
  productionBrowserSourceMaps: false,

  // Reduce logging in production
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Optimize server actions
  serverExternalPackages: ['@prisma/client', 'pg'],
};

export default nextConfig;
