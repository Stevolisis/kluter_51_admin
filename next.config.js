/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  // i18n:{
  //   locales:["en"],
  //   defaultLocale:"en",
  // }
}

module.exports = nextConfig
