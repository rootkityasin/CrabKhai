import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Forced reload for Prisma
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
