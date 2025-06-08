/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // For static exports
  },
};

export default nextConfig;
