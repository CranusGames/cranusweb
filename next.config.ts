import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cranusweb",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
