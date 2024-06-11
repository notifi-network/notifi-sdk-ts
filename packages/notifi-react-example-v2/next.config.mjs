/** @type {import('next').NextConfig} */
import { log } from 'console';
import CopyPlugin from 'copy-webpack-plugin';
import process from 'process';

const args = process.argv;

log(args.join(' '));

let nextConfig = {
  webpack: (config) => {
    /** ⬇️ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    /** ⬇️ For @xmpt/sdk requires .wasm bundled  */
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: 'public/wasm', to: './server/vendor-chunks' }],
      }),
    );
    return config;
  },
};

if (args.includes('build')) {
  nextConfig = {
    ...nextConfig,
    /** ⬇️ For including static index.html: https://nextjs.org/docs/app/building-your-application/deploying/static-exports */
    output: 'export',
    /** ⬇️ For @xmpt/sdk requires .wasm bundled  */
    webpack: (config) => {
      /** ⬇️ For WalletConnect SSR: https://docs.walletconnect.com/web3modal/nextjs/about#extra-configuration */
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      /** ⬇️ For @xmpt/sdk requires .wasm bundled  */
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: 'public/wasm', to: './server/chunks' }],
        }),
      );
      return config;
    },
  };
}

export default nextConfig;
