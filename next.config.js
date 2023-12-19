const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */

const nextConfig = {
  // Copies over the leaflet images to the public folder.
  // It is unclear why this step is necessary, since removing it stills to keep things working regardless.
  // We shamelessly stole it without understanding from:
  // https://github.com/colbyfayock/next-leaflet-starter
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/leaflet/dist/images",
            to: path.resolve(__dirname, "public", "leaflet", "images"),
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
