/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
import { log } from 'console';
import process from 'process';

const args = process.argv;

log(args.join(' '));

let nextConfig = {
  /** ⬇ For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
  experimental: {
    serverComponentsExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  },
  webpack: (config, options) => {
    /** ⬇ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    /** ⬇ For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0'   */
    // config.plugins.push(
    //   new CopyPlugin({
    //     patterns: [{ from: 'public/wasm', to: './server/vendor-chunks' }],
    //   }),
    // );
    /* ⬇ Force css source maps for debugging. If there are performance issues or you don't need debug css, use the value "eval-source-map" instead. https://github.com/vercel/next.js/discussions/47887 */
    if (options.dev) {
      Object.defineProperty(config, 'devtool', {
        get() {
          return 'source-map';
        },
        set() {},
      });
    }
    return config;
  },
};

if (args.includes('build')) {
  nextConfig = {
    ...nextConfig,
    trailingSlash: true,
    /** ⬇ For including static index.html: https://nextjs.org/docs/app/building-your-application/deploying/static-exports */
    output: 'export',
    /** ⬇ For @xmpt/sdk (external bindings wasm files) - Nextjs version >= '^14.2.0'   */
    experimental: {
      serverComponentsExternalPackages: [
        '@xmtp/user-preferences-bindings-wasm',
      ],
    },
    webpack: (config) => {
      /** ⬇ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      /** ⬇ For @xmpt/sdk (external bindings wasm files) - Nextjs version < '^14.2.0'   */
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
