import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { type LoginParamsWithUserParams } from '@notifi-network/notifi-react';
import React, { FC } from 'react';

import { useXmpt } from '../hooks';

export type SignCoinbaseSignature = (
  frontendClient: NotifiFrontendClient,
  web3TargetId: Types.Web3Target['id'],
  senderAddress: string,
) => Promise<Types.Web3TargetFragmentFragment | undefined>;

export type NotifiWalletTargetContextType = {
  isLoading: boolean;
  error: Error | null;
  signCoinbaseSignature: SignCoinbaseSignature;
};

const NotifiWalletTargetContext =
  React.createContext<NotifiWalletTargetContextType>({
    isLoading: false,
    error: null,
    signCoinbaseSignature: async () => {
      console.error(
        'NotifiWalletTargetProvider: ERROR - signCoinbaseSignature not implemented',
      );
      return undefined;
    },
  });

export type NotifiWalletTargetProviderProps = {
  walletWithSignParams: LoginParamsWithUserParams;
};

export const NotifiWalletTargetContextProvider: FC<
  React.PropsWithChildren<NotifiWalletTargetProviderProps>
> = ({ children, walletWithSignParams }) => {
  const contextValue: NotifiWalletTargetContextType = useXmpt({
    walletWithSignParams,
  });

  return (
    <NotifiWalletTargetContext.Provider value={contextValue}>
      {children}
    </NotifiWalletTargetContext.Provider>
  );
};

export const useWalletTargetContext = () =>
  React.useContext(NotifiWalletTargetContext);
