import { Operation, User, WalletBlockchain } from '../models';

export type LogInFromDappInput = Readonly<{
  walletPublicKey: string;
  dappAddress: string;
  timestamp: number;
  signature: string;
  walletBlockchain: WalletBlockchain;
  accountId?: string;
}>;

export type LogInFromDappResult = User;

export type LogInFromDappService = Readonly<{
  logInFromDapp: Operation<LogInFromDappInput, LogInFromDappResult>;
}>;
