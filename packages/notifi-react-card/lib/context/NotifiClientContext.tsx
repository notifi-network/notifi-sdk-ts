import { useNotifiClient } from '@notifi-network/notifi-react-hooks';
import React, { createContext, useContext } from 'react';

import { NotifiParams } from './NotifiContext';

export type NotifiClientContextData = Readonly<{
  client: ReturnType<typeof useNotifiClient>;
  params: NotifiParams;
}>;

const NotifiClientContext = createContext<NotifiClientContextData>(
  {} as unknown as NotifiClientContextData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiClientContextProvider: React.FC<NotifiParams> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  const { dappAddress, env, walletPublicKey, walletBlockchain } = params;
  const client = useNotifiClient({
    dappAddress,
    env,
    walletPublicKey,
    walletBlockchain,
  });

  return (
    <NotifiClientContext.Provider value={{ client, params }}>
      {children}
    </NotifiClientContext.Provider>
  );
};

export const useNotifiClientContext = () => useContext(NotifiClientContext);
