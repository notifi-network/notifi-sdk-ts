import { Operation } from '../models';

export type BeginLogInByTransactionInput = Readonly<{
  walletPublicKey: string;
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
