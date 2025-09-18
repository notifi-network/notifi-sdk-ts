/** @type {import('next').NextConfig} */
import process from 'process';

const args = process.argv;

let nextConfig = {
  images: {
    formats: ['image/webp'],
  },
  /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
  experimental: {
    serverComponentsExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  },

  webpack: (config) => {
    /** ⬇️ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0' */
    //   config.plugins.push(
    //     new CopyPlugin({
    //       patterns: [{ from: 'public/wasm', to: './server/vendor-chunks/' }],
    //     }),
    //   );
    return config;
  },
};

if (args.includes('build')) {
  nextConfig = {
    ...nextConfig,
    trailingSlash: true,
    /** ⬇ For including static index.html: https://nextjs.org/docs/app/building-your-application/deploying/static-exports */
    output: 'export',

    typescript: {
      /** Only enable when debuging */
      ignoreBuildErrors: false,
    },
    eslint: {
      /** Only enable when debuging */
      ignoreDuringBuilds: false,
    },

    /** ⬇ For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
    experimental: {
      serverComponentsExternalPackages: [
        '@xmtp/user-preferences-bindings-wasm',
      ],
    },
    webpack: (config) => {
      /** ⬇️ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0' */
      // config.plugins.push(
      //   new CopyPlugin({
      //     patterns: [{ from: 'public/wasm', to: './server/chunks' }],
      //   }),
      // );
      return config;
    },
  };
}

export default nextConfig;
