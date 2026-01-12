/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverExternalPackages: [
      "@sparticuz/chromium",
      "puppeteer-core"
    ],
  },
 
}

export default nextConfig