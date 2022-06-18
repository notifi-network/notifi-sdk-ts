import { NotifiSubscriptionContextProvider } from '../context';
import type { AlertConfiguration } from '../utils';
import { DeepPartialReadonly } from '../utils';
import type {
  MessageSigner,
  NotifiEnvironment,
} from '@notifi-network/notifi-react-hooks';
import React, { PropsWithChildren } from 'react';

type Props = Readonly<{
  classNames?: DeepPartialReadonly<{
    disconnected: {
      container: string;
      label: string;
    };
    unsupported: {
      container: string;
      label: string;
    };
    connected: {
      container: string;
    };
  }>;
  strings?: DeepPartialReadonly<{
    disconnected: string;
    unsupported: string;
  }>;
  alertConfigurations?: Record<string, AlertConfiguration>;
  dappAddress: string;
  env: NotifiEnvironment;
  keepSubscriptionData?: boolean;
  signer: MessageSigner | null;
  walletPublicKey: string | null;
}>;

export const NotifiCard: React.FC<PropsWithChildren<Props>> = ({
  children,
  classNames,
  strings,
  alertConfigurations,
  dappAddress,
  env,
  keepSubscriptionData,
  signer,
  walletPublicKey,
}) => {
  if (walletPublicKey === null) {
    return (
      <div className={classNames?.disconnected?.container}>
        <span className={classNames?.disconnected?.label}>
          {strings?.disconnected ?? 'Connect your wallet'}
        </span>
      </div>
    );
  } else if (signer === null) {
    return (
      <div className={classNames?.unsupported?.container}>
        <span className={classNames?.unsupported?.label}>
          {strings?.unsupported ?? 'Wallet does not support signing'}
        </span>
      </div>
    );
  } else {
    return (
      <div className={classNames?.connected?.container}>
        <NotifiSubscriptionContextProvider
          {...{
            alertConfigurations,
            dappAddress,
            env,
            keepSubscriptionData,
            signer,
            walletPublicKey,
          }}
        >
          {children}
        </NotifiSubscriptionContextProvider>
      </div>
    );
  }
};
