import {
  LoginParams,
  NotifiEnvironment,
  NotifiFrontendClient,
  NotifiFrontendConfiguration,
  UserParams,
  instantiateFrontendClient,
  isSolanaBlockchain,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { version } from '../../package.json';

export type FrontendClientStatus = {
  isExpired: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

/**
 * @param nonce - The signature signed by any type of transaction with this nonce can be used with the following login method for authentication. NOTE: Nonce is refreshed every 10 minutes, and expires in 15 minutes. So, If a tx process takes more than 5 minutes, it could potentially failed to login due to nonce expiration.
 * @param login - By passing above signature, the user can be authenticated;
 * */
export type LoginViaTransaction = {
  nonce: string;
  login: (
    signatureSignedWithNotifiNonce: string,
  ) => Promise<NotifiFrontendClient | undefined>;
};
export type LoginParamsWithUserParams = LoginParams & UserParams;
export type NotifiFrontendClientContextType = {
  frontendClient: NotifiFrontendClient;
  frontendClientStatus: FrontendClientStatus;
  isLoading: boolean;
  error: Error | null;
  login: () => Promise<NotifiFrontendClient | undefined>;
  logout: () => Promise<void>;
  loginViaHardwareWallet: () => Promise<NotifiFrontendClient | undefined>;
  // In the following cases, loginViaTransaction will be null:
  // 1. If the walletBlockchain prop is OFF_CHAIN
  // 2. If the isEnabledLoginViaTransaction prop is false or undefined
  loginViaTransaction: LoginViaTransaction | null;
  walletWithSignParams: LoginParamsWithUserParams;
};

export const NotifiFrontendClientContext =
  React.createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env?: NotifiEnvironment;
  storageOption?: NotifiFrontendConfiguration['storageOption'];
  isEnabledLoginViaTransaction?: boolean;
} & LoginParamsWithUserParams;

export const NotifiFrontendClientContextProvider: React.FC<
  React.PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({
  children,
  tenantId,
  env,
  storageOption,
  isEnabledLoginViaTransaction,
  ...walletWithSignParams
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [transactionNonce, setTransactionNonce] = React.useState<string | null>(
    null,
  );
  const [frontendClient, setFrontendClient] =
    React.useState<NotifiFrontendClient | null>(null);
  const [frontendClientStatus, setFrontendClientStatus] =
    React.useState<FrontendClientStatus>({
      isExpired: false,
      isInitialized: false,
      isAuthenticated: false,
    });

  const userId =
    walletWithSignParams.walletBlockchain === 'OFF_CHAIN'
      ? walletWithSignParams.userAccount
      : walletWithSignParams.walletPublicKey;

  const isLogInViaTransactionAvailable =
    walletWithSignParams.walletBlockchain !== 'OFF_CHAIN' &&
    isEnabledLoginViaTransaction;

  React.useEffect(() => {
    const requestHeaders = {
      'X-Notifi-Client-Version': version,
    };
    const frontendClient = instantiateFrontendClient(
      tenantId,
      walletWithSignParams,
      env,
      storageOption,
      undefined,
      requestHeaders,
    );

    setIsLoading(true);
    frontendClient.auth
      .initialize()
      .then(() => {
        _refreshFrontendClient(frontendClient);
        setError(null);
      })
      .catch((e) => {
        if (e instanceof Error) {
          setError({
            ...e,
            message: `  failed to initialize frontendClient (.initialize): ${e.message}`,
          });
        }
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  React.useEffect(() => {
    if (
      !frontendClient ||
      !frontendClientStatus.isInitialized ||
      !isLogInViaTransactionAvailable
    )
      return;

    const getNonce = async () => {
      const nonce = await frontendClient?.auth.beginLoginViaTransaction({
        walletAddress: walletWithSignParams.walletPublicKey,
        walletBlockchain: walletWithSignParams.walletBlockchain,
      });
      return nonce.nonce;
    };

    getNonce().then((nonce) => setTransactionNonce(nonce));
    const interval = setInterval(async () => {
      getNonce().then((nonce) => setTransactionNonce(nonce));
    }, 600000); // refresh nonce every 10 minutes (nonce expires in 15 minutes)
    return () => clearInterval(interval);
  }, [frontendClientStatus.isInitialized, isLogInViaTransactionAvailable]);

  const login = async () => {
    if (!frontendClient || !frontendClientStatus.isInitialized) {
      setError(new Error('.login: Frontend client not initialized'));
      return;
    }
    setIsLoading(true);
    try {
      await frontendClient.auth.logIn(walletWithSignParams);
      _refreshFrontendClient(frontendClient);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        const newError = {
          ...error,
          message: `login: Failed to login User rejects to sign, or mis-impl the signMessage method: ${JSON.stringify(
            error.message,
          )}`,
        };
        setError(newError);
        console.error(newError);
      }
    } finally {
      setIsLoading(false);
    }
    return frontendClient;
  };

  const logout = async () => {
    if (!frontendClient) {
      setError(
        new Error('.logout: Failed to logout - client not instantiated'),
      );
      return;
    }
    try {
      await frontendClient?.auth.logOut();
      _refreshFrontendClient(frontendClient);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        const newError = {
          ...error,
          message: `logout: Failed to logout - ${JSON.stringify(error.message)}`,
        };
        setError(newError);
        console.error(newError);
      }
    }
  };

  const _loginViaTransaction = React.useCallback(
    async (signatureSignedWithNotifiNonce: string) => {
      if (!isLogInViaTransactionAvailable) return;
      if (!frontendClient || !frontendClientStatus.isInitialized) {
        setError(
          new Error('.loginViaTransaction: Frontend client not initialized'),
        );
        return;
      }

      setIsLoading(true);
      try {
        await frontendClient?.auth.completeLoginViaTransaction({
          walletAddress: walletWithSignParams.walletPublicKey,
          walletBlockchain: walletWithSignParams.walletBlockchain,
          transactionSignature: signatureSignedWithNotifiNonce,
        });
        _refreshFrontendClient(frontendClient);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          const newError = {
            ...error,
            message: `loginViaTrasaction: failed to call .completeLoginViaTransaction: ${error.message}`,
          };
          setError(newError);
          console.error(newError);
        }
      } finally {
        setIsLoading(false);
      }

      return frontendClient;
    },
    [userId, !!frontendClient, isEnabledLoginViaTransaction],
  );

  const _refreshFrontendClient = React.useCallback(
    (frontendClient: NotifiFrontendClient) => {
      setFrontendClientStatus({
        isExpired: frontendClient.auth.userState?.status === 'expired',
        isInitialized: !!frontendClient,
        isAuthenticated:
          frontendClient.auth.userState?.status === 'authenticated',
      });
      setFrontendClient(frontendClient);
    },
    [setFrontendClientStatus, setFrontendClient],
  );

  /**
   * @description - Only Solana hardware wallet requires a transaction login (rather than signing a message). Reason: MEMO program requires a transaction to verify user's ownership (Ref: https://spl.solana.com/memo)
   */
  const loginViaHardwareWallet = React.useCallback(async () => {
    if (
      !frontendClient ||
      !frontendClientStatus.isInitialized ||
      walletWithSignParams.walletBlockchain === 'OFF_CHAIN' ||
      !isSolanaBlockchain(walletWithSignParams.walletBlockchain) // Only Solana supports hardware wallet login for now
    ) {
      setError(
        new Error(
          '.loginViaHardwareWallet: Frontend client not initialized / or Invalid blockchain',
        ),
      );
      return;
    }
    setIsLoading(true);
    try {
      const loginInput = {
        ...walletWithSignParams,
        isUsingHardwareWallet: true,
      };
      await frontendClient.auth.logIn(loginInput);
      _refreshFrontendClient(frontendClient);
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
    } finally {
      setIsLoading(false);
    }
    return frontendClient;
  }, [userId, !!frontendClient]);

  if (!frontendClient) return null;

  return (
    <NotifiFrontendClientContext.Provider
      value={{
        frontendClient,
        frontendClientStatus,
        isLoading,
        error,
        login,
        logout,
        loginViaHardwareWallet,
        walletWithSignParams,
        loginViaTransaction:
          isLogInViaTransactionAvailable && transactionNonce
            ? {
                nonce: transactionNonce,
                login: _loginViaTransaction,
              }
            : null,
      }}
    >
      {children}
    </NotifiFrontendClientContext.Provider>
  );
};

export const useNotifiFrontendClientContext = () =>
  React.useContext(NotifiFrontendClientContext);
