import { User, Operation } from '../models';

export type LogInFromDappInput = Readonly<{
  walletPublicKey: string;
  dappAddress: string;
  timestamp: number;
  signature: string;
}>;

export type LogInFromDappResult = User;

export type LogInFromDappService = Readonly<{
  logInFromDapp: Operation<LogInFromDappInput, LogInFromDappResult>;
}>;
