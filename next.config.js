/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.builder.io", 'i.scdn.co'],
    dangerouslyAllowSVG: true
  },
};

module.exports = nextConfig
