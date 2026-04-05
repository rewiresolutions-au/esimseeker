import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent folder can be a git root; pin Turbopack to this app so `next` resolves correctly.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
