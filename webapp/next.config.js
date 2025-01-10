/** @type {import('next').NextConfig} */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/api/:path*'
            : '/api/',
      },
    ]
  },

  webpack: (config) => {
    config.plugins.push(new MiniCssExtractPlugin());
    return config;
  },
}

module.exports = nextConfig
