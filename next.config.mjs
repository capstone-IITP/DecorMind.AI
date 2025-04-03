/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  // Disable development mode banner
  devIndicators: {
    position: 'bottom-right', // Updated from buildActivityPosition
  },
  // Enable optimized loading for better performance
  experimental: {
    disableOptimizedLoading: false, // Changed from true to false to enable optimized loading
    disablePostcssPresetEnv: true,
  },
};

export default nextConfig;