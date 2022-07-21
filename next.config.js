/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["lastfm.freetls.fastly.net"],
  },
};

module.exports = nextConfig;
