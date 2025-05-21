/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Important: This tells Next.js where to find your API routes
  // if they're not in the standard location
  experimental: {
    // This is needed if your API routes are in a non-standard location
    // Remove this if you move your API routes to the standard location
    appDir: false,
  },
  // Environment variables are loaded from .env.local
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
