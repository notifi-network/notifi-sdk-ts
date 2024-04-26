import {
  ConfigFactoryInput,
  NotifiFrontendClient,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { NotifiParams } from './NotifiContext';

export type NotifiClientContextData = Readonly<{
  client: ReturnType<typeof useNotifiClient>;
  frontendClient: NotifiFrontendClient;
  isUsingFrontendClient: boolean;
  params: NotifiParams;
  frontendClientStatus: FrontendClientStatus;
  updateFrontendClientStatus: () => void;
}>;

export type FrontendClientStatus = {
  isExpired: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

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
      env: params.env || 'Production',
    };
  } else {
    return {
      account: {
        publicKey: params.walletPublicKey,
      },
      tenantId: params.dappAddress,
      walletBlockchain: params.walletBlockchain,
      env: params.env || 'Production',
    };
  }
};

export const NotifiClientContextProvider: React.FC<NotifiParams> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  const [frontendClientStatus, setFrontendClientStatus] =
    useState<FrontendClientStatus>({
      isExpired: false,
      isInitialized: false,
      isAuthenticated: false,
    });
  const client = useNotifiClient(params);
  const frontendClient = useMemo(() => {
    const configInput = getFrontendConfigInput(params);
    const updatedFrontendClient = newFrontendClient(configInput);
    return updatedFrontendClient;
  }, [
    params.dappAddress,
    params.env || 'Production',
    params.walletBlockchain,
    params.walletPublicKey,
  ]);

  const updateFrontendClientStatus = useCallback(() => {
    setFrontendClientStatus({
      isExpired: frontendClient.userState?.status === 'expired',
      isInitialized: !!frontendClient,
      isAuthenticated: frontendClient.userState?.status === 'authenticated',
    });
  }, [frontendClient]);

  const isClientInitialized = useMemo(() => {
    return params.isUsingFrontendClient
      ? !!frontendClient.userState
      : client.isInitialized;
  }, [params.isUsingFrontendClient, client, frontendClient]);

  useEffect(() => {
    frontendClient.initialize().then(() => updateFrontendClientStatus());
  }, [frontendClient]);

  if (!isClientInitialized) return null;

  return (
    <NotifiClientContext.Provider
      value={{
        client,
        params,
        isUsingFrontendClient: params.isUsingFrontendClient ?? true,
        frontendClient,
        frontendClientStatus,
        updateFrontendClientStatus,
      }}
    >
      {children}
    </NotifiClientContext.Provider>
  );
};

export const useNotifiClientContext = () => useContext(NotifiClientContext);
