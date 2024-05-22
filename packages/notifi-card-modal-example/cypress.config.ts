import { defineConfig } from 'cypress';

export default defineConfig({
  // projectId: 'knn7o8',
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
    DAPP_ADDRESS: 'notifie2e', // Default test tenant (change if needed)
    CARD_ID: '718f2bb0fd80401887643764017cc780', // Default test card (change if needed)
    ENV: 'Production',
    MNEMONIC:
      'civil squeeze word coach always source aunt believe yard urge night alert', // Change to your own mnemonic if needed
    WALLET_BLOCKCHAIN: 'ETHEREUM',
  },
});
