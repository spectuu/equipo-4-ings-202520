/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hemos eliminado `experimental.appDir` porque la versión de Next instalada
  // no reconoce esa clave. Usamos el router de `pages` por defecto.
  images: {
    domains: ['localhost'],
  },
  // Proveer un fallback evita que Next lance un error si la variable
  // de entorno no está definida durante `npm run dev`.
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
}

module.exports = nextConfig
