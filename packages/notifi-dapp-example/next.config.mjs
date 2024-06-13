/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin";

const nextConfig = {
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
  // webpack: ( /** BUILD ONLY */
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  // ) => {
  //   config.plugins.push(new CopyPlugin({
  //     patterns: [
  //       { from: "public/wasm", to: "./server/chunks" },
  //     ],
  //   }))
  //   return config;
  // },
};

export default nextConfig;
