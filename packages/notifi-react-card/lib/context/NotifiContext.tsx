import {
  AcalaSignMessageFunction,
  AptosSignMessageFunction,
  NotifiEnvironment,
  Uint8SignMessageFunction,
} from '@notifi-network/notifi-react-hooks';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import type { Connection } from '@solana/web3.js';
import React from 'react';

import { AlertConfiguration } from '../utils';
import { NotifiClientContextProvider } from './NotifiClientContext';

export type SolanaParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
}>;
export type EthereumParams = Readonly<{
  walletBlockchain: 'ETHEREUM';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;
export type PolygonParams = Readonly<{
  walletBlockchain: 'POLYGON';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;
export type ArbitrumParams = Readonly<{
  walletBlockchain: 'ARBITRUM';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;
export type BinanceParams = Readonly<{
  walletBlockchain: 'BINANCE';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type AptosParams = Readonly<{
  walletBlockchain: 'APTOS';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: AptosSignMessageFunction;
}>;

export type AcalaParams = Readonly<{
  walletBlockchain: 'ACALA';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: AcalaSignMessageFunction;
}>;

export type NearParams = Readonly<{
  walletBlockchain: 'NEAR';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type AvalancheParams = Readonly<{
  walletBlockchain: 'AVALANCHE';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

type WalletParams =
  | SolanaParams
  | EthereumParams
  | PolygonParams
  | AvalancheParams
  | ArbitrumParams
  | BinanceParams
  | AptosParams
  | AcalaParams
  | NearParams
  | AvalancheParams;

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  keepSubscriptionData?: boolean;
}> &
  WalletParams;

export const NotifiContext: React.FC<React.PropsWithChildren<NotifiParams>> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  return (
    <NotifiClientContextProvider {...params}>
      {children}
    </NotifiClientContextProvider>
  );
};
