import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.supabase.co",
            },
            {
                protocol: "https",
                hostname: "storageazureblogify.blob.core.windows.net",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "usalg.org",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
