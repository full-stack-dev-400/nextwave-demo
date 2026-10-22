import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  /*
   * Used when Next.js runs with Turbopack.
   * Loads .glsl shader files as text.
   */
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },

  /*
   * Fallback used when the project runs with Webpack.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/i,
      use: ["raw-loader"],
    });

    return config;
  },
};

export default nextConfig;