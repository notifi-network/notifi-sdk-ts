import { Operation } from '../models';

export type BeginLogInByTransactionInput = Readonly<{
  walletAddress: string;
  walletBlockchain: string;
  dappAddress: string;
}>;

export type BeginLogInByTransactionResult = Readonly<{
  nonce: string;
}>;

export type BeginLogInByTransactionService = Readonly<{
  beginLogInByTransaction: Operation<
    BeginLogInByTransactionInput,
    BeginLogInByTransactionResult
  >;
}>;
