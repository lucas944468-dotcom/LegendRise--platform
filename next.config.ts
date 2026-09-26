import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output keeps the Phase-11 VPS move trivial (`next start`).
  output: "standalone",
};

export default nextConfig;
