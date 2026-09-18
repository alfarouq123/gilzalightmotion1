/**
 * Next.js Configuration untuk Alight Motion Premium Dashboard
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },

  // Rewrites untuk API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/amp/:path*',
          destination: '/api/amp/:path*',
        },
      ],
    }
  },

  // Build optimization
  webpack: (config, { isServer }) => {
    return config
  },
}

module.exports = nextConfig
