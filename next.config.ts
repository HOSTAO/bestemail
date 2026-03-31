import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Rewrite /embed/FORM_ID.js → /api/embed/FORM_ID (serves embed JS widget)
      {
        source: '/embed/:formId.js',
        destination: '/api/embed/:formId',
      },
    ];
  },
};

export default nextConfig;
