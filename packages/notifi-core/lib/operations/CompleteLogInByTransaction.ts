import { Operation, User } from '../models';

export type CompleteLogInByTransactionInput = Readonly<{
  walletAddress: string;
  walletBlockchain: string;
  dappAddress: string;
  randomUuid: string;
  transactionSignature: string;
}>;

export type CompleteLogInByTransactionResult = Readonly<User>;

export type CompleteLogInByTransactionService = Readonly<{
  completeLogInByTransaction: Operation<
    CompleteLogInByTransactionInput,
    CompleteLogInByTransactionResult
  >;
}>;
