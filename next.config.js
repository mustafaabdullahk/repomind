/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // Enables static exports
  trailingSlash: true, // Add trailing slashes
  images: {
    domains: ['avatars.githubusercontent.com'],
    unoptimized: true, // Required for static export
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Get the repository name from environment or default to 'repomind'
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Improve static export for client components
  experimental: {
    // These are no longer needed in newest Next.js versions, but keeping them for compatibility
    appDir: true,
    serverComponentsExternalPackages: []
  }
};

module.exports = nextConfig; 