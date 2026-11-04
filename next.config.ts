import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // hayakulab.com → www.hayakulab.com (Vercel también lo puede hacer desde Domains)
    return [];
  },
};

export default nextConfig;
