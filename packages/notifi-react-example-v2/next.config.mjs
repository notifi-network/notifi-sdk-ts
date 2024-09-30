/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import { log } from 'console';
import process from 'process';

const args = process.argv;

log(args.join(' '));

let nextConfig = {
  /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
  experimental: {
    serverComponentsExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  },
  webpack: (config) => {
    /** ⬇ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0'   */
    // config.plugins.push(
    //   new CopyPlugin({
    //     patterns: [{ from: 'public/wasm', to: './server/vendor-chunks' }],
    //   }),
    // );
    return config;
  },
};

if (args.includes('build')) {
  nextConfig = {
    ...nextConfig,
    /** ⬇ For including static index.html: https://nextjs.org/docs/app/building-your-application/deploying/static-exports */
    output: 'export',
    /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
    experimental: {
      serverComponentsExternalPackages: [
        '@xmtp/user-preferences-bindings-wasm',
      ],
    },
    webpack: (config) => {
      /** ⬇ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      /** ⬇For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0'   */
      // config.plugins.push(
      //   new CopyPlugin({
      //     patterns: [{ from: 'public/wasm', to: './server/chunks' }],
      //   }),
      // );
      return config;
    },
  };
}

/** Next bundler analyzer. Reference: https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
