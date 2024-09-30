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
    /** ⬇ For including static index.html: https://nextjs.org/docs/app/building-your-application/deploying/static-exports */
    output: 'export',

    // TODO: Remove below two blocks (eslint and typescript): rather than ignoring errors during build, fix them in the codebase
    typescript: {
      /** BUILD ONLY */
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      /** BUILD ONLY */
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
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
