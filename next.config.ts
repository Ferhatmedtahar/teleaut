import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /* config options here */
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: "2048mb",
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kduodvrtdkdbbfthjstp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
