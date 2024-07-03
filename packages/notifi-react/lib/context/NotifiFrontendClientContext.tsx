import {
  ConfigFactoryInput,
  NotifiEnvironment,
  NotifiFrontendClient,
  Uint8SignMessageFunction,
  WalletWithSignParams as WalletWithSignParamsRaw,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { HardwareLoginPlugin } from 'notifi-react-card/lib/plugins';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useHardwareWallet } from '../hooks/useSolanaHardwareWallet';

export type FrontendClientStatus = {
  isExpired: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

export type NotifiFrontendClientContextType = {
  frontendClient: NotifiFrontendClient;
  frontendClientStatus: FrontendClientStatus;
  isLoading: boolean;
  error: Error | null;
  login: () => Promise<NotifiFrontendClient | undefined>;
  loginViaHardwareWallet?: () => Promise<NotifiFrontendClient | undefined>;
  walletWithSignParams: WalletWithSignParams;
};

export const NotifiFrontendClientContext =
  createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

// NOTE: The Utils type for Solana hardware wallet login specifically
type SolanaParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;
// NOTE: The Utils type for Solana hardware wallet login specifically
type WalletWithSignParamsWoSolana = Exclude<
  WalletWithSignParamsRaw,
  SolanaParams
>;
// NOTE: The Utils type for Solana hardware wallet login specifically
type SolanaParamsWithHardwareLoginPlugin = SolanaParams & {
  hardwareLoginPlugin: HardwareLoginPlugin;
};
export type WalletWithSignParams =
  | WalletWithSignParamsWoSolana
  | SolanaParamsWithHardwareLoginPlugin;

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env?: NotifiEnvironment;
} & WalletWithSignParams;

export const NotifiFrontendClientContextProvider: FC<
  PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({ children, tenantId, env, ...walletWithSignParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [frontendClient, setFrontendClient] =
    useState<NotifiFrontendClient | null>(null);
  const [frontendClientStatus, setFrontendClientStatus] =
    useState<FrontendClientStatus>({
      isExpired: false,
      isInitialized: false,
      isAuthenticated: false,
    });
  const { login: loginViaHardwareWalletImpl } =
    useHardwareWallet(walletWithSignParams);

  useEffect(() => {
    const configInput = getFrontendConfigInput(
      tenantId,
      walletWithSignParams,
      env,
    );
    const frontendClient = newFrontendClient(configInput);

    setIsLoading(true);
    frontendClient
      .initialize()
      .then(() => {
        setFrontendClientStatus({
          isExpired: frontendClient.userState?.status === 'expired',
          isInitialized: !!frontendClient,
          isAuthenticated: frontendClient.userState?.status === 'authenticated',
        });
        setFrontendClient(frontendClient);
        setError(null);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }, [walletWithSignParams.walletPublicKey]);

  const login = async () => {
    if (!frontendClient) return;
    // TODO: Implement a more general hardware wallet login frontendClientMethod.
    // if (loginMethod === 'hardwareWallet') { return frontendClient.loginWithHardwareWallet(); }
    setIsLoading(true);
    try {
      await frontendClient.logIn(walletWithSignParams);
      setFrontendClientStatus({
        isExpired: frontendClient.userState?.status === 'expired',
        isInitialized: !!frontendClient,
        isAuthenticated: frontendClient.userState?.status === 'authenticated',
      });
      setFrontendClient(frontendClient);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        const newError = {
          ...error,
          message: `login: User rejects to sign, or mis-impl the signMessage method: ${error.message}`,
        };
        setError(newError);
        console.error(newError);
      }
    } finally {
      setIsLoading(false);
    }
    return frontendClient;
  };

  const loginViaHardwareWallet = async () => {
    if (!frontendClient) return;
    try {
      await loginViaHardwareWalletImpl(frontendClient);
      setFrontendClientStatus({
        isExpired: frontendClient.userState?.status === 'expired',
        isInitialized: !!frontendClient,
        isAuthenticated: frontendClient.userState?.status === 'authenticated',
      });
      setFrontendClient(frontendClient);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        const newError = {
          ...error,
          message: `loginViaHardwareWallet: User rejects to sign, or mis-impl the signMessage method: ${error.message}`,
        };
        setError(newError);
        console.error(newError);
      }
    }
    return frontendClient;
  };

  if (!frontendClient) return null;

  return (
    <NotifiFrontendClientContext.Provider
      value={{
        frontendClient,
        frontendClientStatus,
        isLoading,
        error,
        login,
        loginViaHardwareWallet,
        walletWithSignParams,
      }}
    >
      {children}
    </NotifiFrontendClientContext.Provider>
  );
};

export const useNotifiFrontendClientContext = () =>
  useContext(NotifiFrontendClientContext);

// Utils

const getFrontendConfigInput = (
  tenantId: string,
  params: WalletWithSignParams,
  env?: NotifiEnvironment,
): ConfigFactoryInput => {
  if ('accountAddress' in params) {
    return {
      account: {
        address: params.accountAddress,
        publicKey: params.walletPublicKey,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else if ('signingPubkey' in params) {
    return {
      account: {
        publicKey: params.walletPublicKey,
        delegatorAddress: params.signingPubkey,
        address: params.signingAddress,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else {
    return {
      account: {
        publicKey: params.walletPublicKey,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  }
};
