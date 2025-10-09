/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Usamos pages router
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
