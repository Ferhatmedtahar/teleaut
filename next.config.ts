import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.bunnycdn.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
};

export default nextConfig;
