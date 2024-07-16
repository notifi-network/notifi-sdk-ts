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
    PRC_ENDPINT:
      'https://mainnet.infura.io/v3/9c9ff698105d4f6b9b2b93eddc0dff72', // Change to your own EVM rpc endpoint
    DAPP_ADDRESS: 'ueq5rm4w8vconyp9hkd1', // Default test tenant (change if needed)
    CARD_ID: '61442256a6e9458cadc053a19be67ecc', // Default test card (change if needed)
    ENV: 'Production',
    MNEMONIC:
      'civil squeeze word coach always source aunt believe yard urge night alert', // Change to your own mnemonic if needed
    WALLET_BLOCKCHAIN: 'ETHEREUM',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
