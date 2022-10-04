import {
  MessageSigner,
  NotifiEnvironment,
} from '@notifi-network/notifi-react-hooks';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import type { Connection } from '@solana/web3.js';
import React from 'react';

import { AlertConfiguration } from '../utils';
import { NotifiClientContextProvider } from './NotifiClientContext';
import { NotifiSubscriptionContextProvider } from './NotifiSubscriptionContext';

export type SolanaParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
}>;
export type EthereumParams = Readonly<{
  walletBlockchain: 'ETHEREUM';
  walletPublicKey: string;
}>;

export type AptosParams = Readonly<{
  walletBlockchain: 'APTOS';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  signer: MessageSigner;
  keepSubscriptionData?: boolean;
}> &
  (SolanaParams | EthereumParams | AptosParams);

export const NotifiContext: React.FC<React.PropsWithChildren<NotifiParams>> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  return (
    <NotifiClientContextProvider {...params}>
      <NotifiSubscriptionContextProvider {...params}>
        {children}
      </NotifiSubscriptionContextProvider>
    </NotifiClientContextProvider>
  );
};
