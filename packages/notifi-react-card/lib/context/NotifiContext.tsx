import { WalletWithSignParams } from '@notifi-network/notifi-core';
import {
  AcalaSignMessageFunction,
  AptosSignMessageFunction,
  NotifiEnvironment,
  Uint8SignMessageFunction,
} from '@notifi-network/notifi-react-hooks';
import React from 'react';

import { HardwareLoginPlugin } from '../plugins';
import { AlertConfiguration } from '../utils';
import { NotifiClientContextProvider } from './NotifiClientContext';
import { NotifiFormProvider } from './NotifiFormContext';
import { NotifiSubscriptionContextProvider } from './NotifiSubscriptionContext';

export type SolanaParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
  hardwareLoginPlugin: HardwareLoginPlugin;
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
export type ZksyncParams = Readonly<{
  walletBlockchain: 'ZKSYNC';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type AcalaParams = Readonly<{
  walletBlockchain: 'ACALA';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: AcalaSignMessageFunction;
}>;

export type OptimismParams = Readonly<{
  walletBlockchain: 'OPTIMISM';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type NearParams = Readonly<{
  walletBlockchain: 'NEAR';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type InjectiveParams = Readonly<{
  walletBlockchain: 'INJECTIVE';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type OsmosisParams = Readonly<{
  walletBlockchain: 'OSMOSIS';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type NibiruParams = Readonly<{
  walletBlockchain: 'NIBIRU';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type AvalancheParams = Readonly<{
  walletBlockchain: 'AVALANCHE';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type SuiParams = Readonly<{
  walletBlockchain: 'SUI';
  accountAddress: string;
  walletPublicKey: string; // The same as accountAddress
  signMessage: Uint8SignMessageFunction;
}>;

export type MultiWalletParams = Readonly<{
  ownedWallets: ReadonlyArray<WalletWithSignParams>;
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
  | AvalancheParams
  | OptimismParams
  | InjectiveParams
  | OsmosisParams
  | NibiruParams
  | SuiParams
  | ZksyncParams;

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  keepSubscriptionData?: boolean;
  multiWallet?: MultiWalletParams;
  enableCanary?: boolean;
}> &
  WalletParams;

export const NotifiContext: React.FC<React.PropsWithChildren<NotifiParams>> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  return (
    <NotifiClientContextProvider {...params}>
      <NotifiFormProvider>
        <NotifiSubscriptionContextProvider {...params}>
          {children}
        </NotifiSubscriptionContextProvider>
      </NotifiFormProvider>
    </NotifiClientContextProvider>
  );
};
