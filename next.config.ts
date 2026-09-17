import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/BWRF-member',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/BWRF-admin',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
