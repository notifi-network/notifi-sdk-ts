import { WalletBlockchain } from '../models';
import { Operation } from '../models';
import { Web3AuthType } from '../models/Web3AuthType';

export type BeginLogInWithWeb3Input = Readonly<{
  web3AuthType: Web3AuthType;
  blockchainType: WalletBlockchain;
  authAddress: string;
  dappAddress: string;
  walletPubkey?: string;
}>;

export type BeginLogInWithWeb3Result = Readonly<{
  nonce: string;
}>;

export type BeginLogInWithWeb3Service = Readonly<{
  beginLogInWithWeb3: Operation<
    BeginLogInWithWeb3Input,
    BeginLogInWithWeb3Result
  >;
}>;
