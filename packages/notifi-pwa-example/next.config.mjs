/** @type {import('next').NextConfig} */
import CopyPlugin from 'copy-webpack-plugin';

const nextConfig = {
  /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0' */
  experimental: {
    serverComponentsExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  },
  webpack: (config) => {
    /** ⬇️ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.plugins.push(
      new CopyPlugin({
        // ⬇️ Copy the built notifi-service-worker.js to the public folder. For more details, refer to the README.md#installation-&-setup of the notifi-web-push-service-worker package.
        patterns: [
          {
            from: '../notifi-web-push-service-worker/dist/notifi-service-worker.js',
            to: '../public/',
          },
        ],
      }),
    );
    return config;
  },
};

export default nextConfig;
