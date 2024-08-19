/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'maps.googleapis.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
