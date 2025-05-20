import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'knn7o8',
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    requestTimeout: 20000,
  },
  env: {
    /* ⬇ CARD MODAL ENV VARS */
    PRC_ENDPINT:
      'https://mainnet.infura.io/v3/9c9ff698105d4f6b9b2b93eddc0dff72', // Change to your own EVM rpc endpoint
    DAPP_ADDRESS: 'ueq5rm4w8vconyp9hkd1', // Default test tenant (change if needed)
    CARD_ID: '61442256a6e9458cadc053a19be67ecc', //tenant config v1
    // CARD_ID: '0196d259e0aa7676a2b7068dcdfc4b0b', // tenant config v2 (TODO: Use this version after fully V2 migration)
    ENV: 'Production',
    MNEMONIC:
      'civil squeeze word coach always source aunt believe yard urge night alert', // Change to your own mnemonic if needed
    WALLET_BLOCKCHAIN: 'ETHEREUM',

    /* ⬇ SMARTLINK ENV VARS */
    SMARTLINK_ENV: 'Production',
    SMARTLINK_ID: '1e74002c84f3445480c54424a145a62a',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
