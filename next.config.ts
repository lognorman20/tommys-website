import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    loader: "akamai",
    path: "/",
  },
};

export default nextConfig;
