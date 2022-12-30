import { WalletBlockchain } from './WalletBlockchain';

export type TenantConnectedWallet = Readonly<{
  address: string;
  walletBlockchain: WalletBlockchain;
}>;
