import {
  WalletWithSignParams,
  XionSignMessageFunction,
} from '@notifi-network/notifi-frontend-client';
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

export type EvmosParams = Readonly<{
  walletBlockchain: 'EVMOS';
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

export type BaseParams = Readonly<{
  walletBlockchain: 'BASE';
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

export type AxelarParams = Readonly<{
  walletBlockchain: 'AXELAR';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type ArchwayParams = Readonly<{
  walletBlockchain: 'ARCHWAY';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type NeutronParams = Readonly<{
  walletBlockchain: 'NEUTRON';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type AgoricParams = Readonly<{
  walletBlockchain: 'AGORIC';
  accountAddress: string;
  walletPublicKey: string; // The same as accountAddress
  signMessage: Uint8SignMessageFunction;
}>;

export type OraiParams = Readonly<{
  walletBlockchain: 'ORAI';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type KavaParams = Readonly<{
  walletBlockchain: 'KAVA';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type CelestiaParams = Readonly<{
  walletBlockchain: 'CELESTIA';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type CosmosParams = Readonly<{
  walletBlockchain: 'COSMOS';
  accountAddress: string;
  walletPublicKey: string; // The same as accountAddress
  signMessage: Uint8SignMessageFunction;
}>;

export type DymensionParams = Readonly<{
  walletBlockchain: 'DYMENSION';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type PersistenceParams = Readonly<{
  walletBlockchain: 'PERSISTENCE';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type DydxParams = Readonly<{
  walletBlockchain: 'DYDX';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type ElysParams = Readonly<{
  walletBlockchain: 'ELYS';
  accountAddress: string;
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type XionParams = Readonly<{
  walletBlockchain: 'XION';
  walletPublicKey: string;
  signingAddress: string;
  signingPubkey: string;
  message: string;
  signMessage: XionSignMessageFunction;
}>;

export type BlastParams = Readonly<{
  walletBlockchain: 'BLAST';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type CeloParams = Readonly<{
  walletBlockchain: 'CELO';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type MantleParams = Readonly<{
  walletBlockchain: 'MANTLE';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type LineaParams = Readonly<{
  walletBlockchain: 'LINEA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type ScrollParams = Readonly<{
  walletBlockchain: 'SCROLL';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type MantaParams = Readonly<{
  walletBlockchain: 'MANTA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type MonadParams = Readonly<{
  walletBlockchain: 'MONAD';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type BerachainParams = Readonly<{
  walletBlockchain: 'BERACHAIN';
  walletPublicKey: string;
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
  | BaseParams
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
  | ZksyncParams
  | AxelarParams
  | ArchwayParams
  | NeutronParams
  | ElysParams
  | XionParams
  | BlastParams
  | CeloParams
  | MantleParams
  | LineaParams
  | ScrollParams
  | MantaParams
  | MonadParams
  | BerachainParams
  | EvmosParams
  | AgoricParams
  | OraiParams
  | KavaParams
  | CelestiaParams
  | CosmosParams
  | DymensionParams
  | PersistenceParams
  | DydxParams;

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env?: NotifiEnvironment;
  keepSubscriptionData?: boolean;
  multiWallet?: MultiWalletParams;
  isUsingFrontendClient?: boolean; // default is true
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
