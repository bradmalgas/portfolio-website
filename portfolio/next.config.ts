import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false, // Displays a static indicator in the bottom corner of the screen that signals if a route will be prerendered at build time. This makes it easier to understand whether a route is static or dynamic
}
};

export default nextConfig;
