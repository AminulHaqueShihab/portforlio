/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip bundling mongoose/mongodb: webpack's resolver chokes on some nested
  // package.json export maps (pnpm + mongo driver → "Default condition should be last").
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
  },
};

export default nextConfig;
