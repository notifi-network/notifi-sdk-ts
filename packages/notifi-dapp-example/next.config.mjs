/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";
import process from 'process';

const args = process.argv;

let nextConfig = {
  // output: 'export' /** BUILD ONLY */,
  images: {
    formats: ['image/webp'],
  },
  
  // typescript: { /** BUILD ONLY */
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
  // eslint: { /** BUILD ONLY */
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(new CopyPlugin({
      patterns: [
        // { from: "public/wasm", to: "./server/chunks" }, /** BUILD ONLY */
        { from: "public/wasm", to: "./server/vendor-chunks/" },
      ],
    }))
    return config;
  },
};

if (args.includes('build')) {
  nextConfig = {
    ...nextConfig,
  output: 'export' /** BUILD ONLY */,
  
  typescript: { /** BUILD ONLY */
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: { /** BUILD ONLY */
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(new CopyPlugin({
      patterns: [
        { from: "public/wasm", to: "./server/chunks" }, /** BUILD ONLY */
        { from: "public/wasm", to: "./server/vendor-chunks/" },
      ],
    }))
    return config;
  },
  };
}

export default nextConfig;
