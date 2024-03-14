import { Operation, User } from '../models';

export type CompleteLogInWithWeb3Input = Readonly<{
  nonce: string;
  signedMessage: string;
  signature: string;
  signingAddress: string;
  signingPubkey?: string;
}>;

export type CompleteLogInWithWeb3Result = Readonly<User>;

export type CompleteLogInWithWeb3Service = Readonly<{
  completeLogInWithWeb3: Operation<
    CompleteLogInWithWeb3Input,
    CompleteLogInWithWeb3Result
  >;
}>;
