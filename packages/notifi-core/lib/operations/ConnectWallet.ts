import { ConnectedWallet, Operation, WalletBlockchain } from '../models';

export type ConnectWalletInput = Readonly<{
  walletPublicKey: string;
  timestamp: number;
  signature: string;
  walletBlockchain: WalletBlockchain;
  accountId?: string;
  connectWalletConflictResolutionTechnique?:
    | 'FAIL'
    | 'DISCONNECT'
    | 'DISCONNECT_AND_CLOSE_OLD_ACCOUNT';
}>;

export type ConnectWalletResult = ConnectedWallet;

export type ConnectWalletService = Readonly<{
  connectWallet: Operation<ConnectWalletInput, ConnectWalletResult>;
}>;
