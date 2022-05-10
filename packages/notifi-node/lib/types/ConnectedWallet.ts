import { UserWithAlerts } from './UserWithAlerts';
import { WalletBlockchain } from './WalletBlockchain';

export type ConnectedWallet = Readonly<{
  address: string;
  walletBlockchain: WalletBlockchain;
  user: UserWithAlerts;
}>;
