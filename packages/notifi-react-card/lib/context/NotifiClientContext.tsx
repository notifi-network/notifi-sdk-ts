import {
  ConfigFactoryInput,
  NotifiFrontendClient,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { NotifiParams } from './NotifiContext';

export type NotifiClientContextData = Readonly<{
  client: ReturnType<typeof useNotifiClient>;
  frontendClient: NotifiFrontendClient;
  isUsingFrontendClient: boolean;
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
    const updatedFrontendClient = newFrontendClient(configInput);
    return updatedFrontendClient;
  }, [
    params.dappAddress,
    params.env,
    params.walletBlockchain,
    params.walletPublicKey,
  ]);

  const isClientInitialized = useMemo(() => {
    return params.isUsingFrontendClient
      ? !!frontendClient.userState
      : client.isInitialized;
  }, [params.isUsingFrontendClient, client, frontendClient]);

  useEffect(() => {
    frontendClient.initialize();
  }, [frontendClient]);

  if (!isClientInitialized) return null;

  return (
    <NotifiClientContext.Provider
      value={{
        client,
        params,
        isUsingFrontendClient: params.isUsingFrontendClient ?? true,
        frontendClient,
      }}
    >
      {children}
    </NotifiClientContext.Provider>
  );
};

export const useNotifiClientContext = () => useContext(NotifiClientContext);
