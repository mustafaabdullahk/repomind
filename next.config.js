/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // Enables static exports
  trailingSlash: true, // Add trailing slashes
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Get the repository name from environment or default to 'repomind'
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Set these variables for static export
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: 'true',
    CI: 'false', // Needed for client components to work in static export
    FORCE_PARTIAL_HYDRATION: 'true' // Enable partial hydration
  },

  // Experimental features
  experimental: {
    // Isolate client components for static export
    optimizeClientComponents: false,
    // Support external packages
    serverComponentsExternalPackages: [
      'langchain',
      'js-tiktoken'
    ]
  }
};

module.exports = nextConfig; 