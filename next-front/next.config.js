// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost', // Replace with your image host
          port: '8000',
        },
      ],
    },
  };
  
  module.exports = nextConfig;