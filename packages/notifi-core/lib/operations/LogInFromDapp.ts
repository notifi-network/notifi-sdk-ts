import { Operation, User } from '../models';

export type LogInFromDappInput = Readonly<{
  walletPublicKey: string;
  dappAddress: string;
  timestamp: number;
  signature: string;
  walletBlockchain:
    | 'SOLANA'
    | 'ETHEREUM'
    | 'APTOS'
    | 'POLYGON'
    | 'ARBITRUM'
    | 'BINANCE';
  accountId?: string;
}>;

export type LogInFromDappResult = User;

export type LogInFromDappService = Readonly<{
  logInFromDapp: Operation<LogInFromDappInput, LogInFromDappResult>;
}>;
