import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // domains: ["localhost", "res.cloudinary.com", "bufferwall.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/imc-austrian-flood-monitor/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "bufferwall.com",
        pathname: "/**",
      }
    ],
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "imc-austrian-flood-monitor",
  },
};

export default nextConfig;
