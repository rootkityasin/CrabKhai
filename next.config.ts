import type { NextConfig } from "next";
import { withBotId } from 'botid/next/config';

const nextConfig: NextConfig = {
  /* config options here */
  // Forced reload for Prisma
};

export default withBotId(nextConfig);
