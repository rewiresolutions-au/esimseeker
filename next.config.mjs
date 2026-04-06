import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  // Parent folder can be a git root; pin Turbopack to this app for local dev.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
