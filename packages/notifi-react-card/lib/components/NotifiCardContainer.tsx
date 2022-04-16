import React from 'react';
import type { BlockchainEnvironment, MessageSigner } from '@notifi-network/notifi-react-hooks';
import type { AlertConfiguration, NotifiCopyData, NotifiStyleData } from '../context';
import { NotifiCopyContextProvider, NotifiStyleContextProvider, NotifiSubscriptionContextProvider } from '../context';
import { NotifiCard } from './NotifiCard';
import { NotifiWalletConnectedContents } from './NotifiWalletConnectedContents';
import { NotifiWalletDisconnectedContents } from './NotifiWalletDisconnectedContents';
import { NotifiWalletUnsupportedContents } from './NotifiWalletUnsupportedContents';

export type Props = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration>;
  copy: NotifiCopyData;
  classNames: NotifiStyleData;
  signer: MessageSigner | null;
  walletPublicKey: string | null;
  dappAddress: string;
  env?: BlockchainEnvironment;
}>;

export const NotifiCardContainer: React.FC<Props> = ({
  alertConfigurations,
  children,
  copy,
  classNames,
  signer,
  walletPublicKey,
  dappAddress,
  env,
}: React.PropsWithChildren<Props>) => {
  let contents: React.ReactChild;
  if (walletPublicKey === null) {
    contents = <NotifiWalletDisconnectedContents />;
  } else if (signer === null) {
    contents = <NotifiWalletUnsupportedContents />;
  } else {
    contents = (
      <NotifiWalletConnectedContents
        dappAddress={dappAddress}
        walletPublicKey={walletPublicKey}
        env={env}
        signer={signer}
      >
        {children}
      </NotifiWalletConnectedContents>
    );
  }

  return (
    <NotifiSubscriptionContextProvider alertConfigurations={alertConfigurations}>
      <NotifiCopyContextProvider {...copy}>
        <NotifiStyleContextProvider {...classNames}>
          <NotifiCard>{contents}</NotifiCard>
        </NotifiStyleContextProvider>
      </NotifiCopyContextProvider>
    </NotifiSubscriptionContextProvider>
  );
};
