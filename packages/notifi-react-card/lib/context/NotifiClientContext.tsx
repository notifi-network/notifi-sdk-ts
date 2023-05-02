import {
  ConfigFactoryInput,
  NotifiFrontendClient,
  newFrontendClient,
  newFrontendConfig,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { NotifiParams } from './NotifiContext';

export type NotifiClientContextData = Readonly<{
  client: ReturnType<typeof useNotifiClient>;
  canary: {
    isActive: boolean;
    frontendClient: NotifiFrontendClient;
  };
  params: NotifiParams;
}>;

const NotifiClientContext = createContext<NotifiClientContextData>(
  {} as unknown as NotifiClientContextData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

const getFrontendConfigInput = (params: NotifiParams): ConfigFactoryInput => {
  if ('accountAddress' in params) {
    return {
      account: {
        address: params.accountAddress,
        publicKey: params.walletPublicKey,
      },
      tenantId: params.dappAddress,
      walletBlockchain: params.walletBlockchain,
      env: params.env,
    };
  } else {
    return {
      account: {
        publicKey: params.walletPublicKey,
      },
      tenantId: params.dappAddress,
      walletBlockchain: params.walletBlockchain,
      env: params.env,
    };
  }
};

export const NotifiClientContextProvider: React.FC<NotifiParams> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  const client = useNotifiClient(params);

  const frontendClient = useMemo(() => {
    const configInput = getFrontendConfigInput(params);
    const config = newFrontendConfig(configInput);
    return newFrontendClient(config);
  }, [
    params.dappAddress,
    params.env,
    params.walletBlockchain,
    params.walletPublicKey,
  ]);

  useEffect(() => {
    // Init frontend client
    if (!frontendClient.userState) {
      frontendClient.initialize();
    }
  }, [frontendClient]);

  return (
    <NotifiClientContext.Provider
      value={{
        client,
        params,
        canary: { isActive: params.enableCanary ?? false, frontendClient },
      }}
    >
      {children}
    </NotifiClientContext.Provider>
  );
};

export const useNotifiClientContext = () => useContext(NotifiClientContext);
