import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ["@visapath/shared"]
};

export default nextConfig;
