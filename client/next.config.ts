import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "www.preventionweb.net",
      "imgl.krone.at",
      "bufferwall.com",
    ],
  },
};

export default nextConfig;
