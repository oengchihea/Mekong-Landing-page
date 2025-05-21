/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: The 'appDir' option has been removed as it's deprecated in Next.js 15
  // API routes in /pages/api are automatically detected without any special configuration
  experimental: {
    // You can add other experimental features here if needed
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
