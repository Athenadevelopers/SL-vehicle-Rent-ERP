/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static HTML export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
    domains: ['firebasestorage.googleapis.com'],
  },
  // Configure basePath if you're not deploying to the root of your domain
  // basePath: '/sri-lanka-vehicle-rental-erp',
};

export default nextConfig;
