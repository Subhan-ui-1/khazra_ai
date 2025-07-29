import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    // assetPrefix: './',
    images: {
        unoptimized: true, 
    },
  /* config options here */
    eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
