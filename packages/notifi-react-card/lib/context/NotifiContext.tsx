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

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  signer: MessageSigner;
  walletPublicKey: string;
  walletBlockchain: 'SOLANA' | 'ETHEREUM';
  keepSubscriptionData?: boolean;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
}>;

export const NotifiContext: React.FC<NotifiParams> = ({
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
