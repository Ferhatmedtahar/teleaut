import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "2048mb",
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
      {
        protocol: "https",
        hostname: "mypullzonecognacia.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "cognacia.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;
