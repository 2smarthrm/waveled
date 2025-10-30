/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // não falha o build por causa do ESLint
  },
};
export default nextConfig;
