import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Adjust the size limit as per your requirement
    },
  },
};

export default nextConfig;
