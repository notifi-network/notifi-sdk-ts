import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
    requestTimeout: 20000,
  },
  env: {
    PRC_ENDPINT:
      'https://mainnet.infura.io/v3/9c9ff698105d4f6b9b2b93eddc0dff72',
    DAPP_ADDRESS: 'notifie2e',
    CARD_ID: '718f2bb0fd80401887643764017cc780',
    ENV: 'Production',
    MNEMONIC:
      'civil squeeze word coach always source aunt believe yard urge night alert',
    WALLET_BLOCKCHAIN: 'ETHEREUM',
  },
});
