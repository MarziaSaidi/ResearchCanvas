import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent dir from stray lockfiles.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
