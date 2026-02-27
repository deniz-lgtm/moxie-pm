import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.cdn.appfolio.com",
      },
      {
        protocol: "https",
        hostname: "listings.cdn.appfolio.com",
      },
    ],
  },
};

export default nextConfig;
