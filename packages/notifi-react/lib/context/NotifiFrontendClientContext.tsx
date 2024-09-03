import {
  NotifiEnvironment,
  NotifiEnvironmentConfiguration,
  NotifiFrontendClient,
  WalletWithSignParams,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { loginViaSolanaHardwareWallet } from '../utils';

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

export type NotifiFrontendClientContextType = {
  frontendClient: NotifiFrontendClient;
  frontendClientStatus: FrontendClientStatus;
  isLoading: boolean;
  error: Error | null;
  login: () => Promise<NotifiFrontendClient | undefined>;
  loginViaHardwareWallet: () => Promise<NotifiFrontendClient | undefined>;
  loginViaTransaction: LoginViaTransaction;
  walletWithSignParams: WalletWithSignParams;
};

export const NotifiFrontendClientContext =
  React.createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env?: NotifiEnvironment;
  storageOption?: NotifiEnvironmentConfiguration['storageOption'];
} & WalletWithSignParams;

export const NotifiFrontendClientContextProvider: React.FC<
  React.PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({ children, tenantId, env, storageOption, ...walletWithSignParams }) => {
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

  React.useEffect(() => {
    const frontendClient = instantiateFrontendClient(
      tenantId,
      walletWithSignParams,
      env,
      storageOption,
    );

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
    if (!frontendClient || !frontendClientStatus.isInitialized) return;
    if (walletWithSignParams.walletBlockchain === 'OFF_CHAIN')
      return setTransactionNonce('off-chain-sign-in');

    const getNonce = async () => {
      const nonce = await frontendClient?.beginLoginViaTransaction({
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
  }, [frontendClientStatus.isInitialized]);

  const login = async () => {
    if (!frontendClient || !frontendClientStatus.isInitialized) {
      setError(new Error('.login: Frontend client not initialized'));
      return;
    }
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

  const loginViaTransaction = React.useCallback(
    async (signatureSignedWithNotifiNonce: string) => {
      if (
        !frontendClient ||
        !frontendClientStatus.isInitialized ||
        walletWithSignParams.walletBlockchain === 'OFF_CHAIN'
      ) {
        setError(
          new Error(
            '.loginViaTransaction: Frontend client not initialized / or Invalid blockchain',
          ),
        );
        return;
      }
      setIsLoading(true);
      try {
        await frontendClient?.completeLoginViaTransaction({
          walletAddress: walletWithSignParams.walletPublicKey,
          walletBlockchain: walletWithSignParams.walletBlockchain,
          transactionSignature: signatureSignedWithNotifiNonce,
        });
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
    [userId, !!frontendClient],
  );

  /**
   * @description - Only Solana hardware wallet requires a transaction login (rather than signing a message). Reason: MEMO program requires a transaction to verify user's ownership (Ref: https://spl.solana.com/memo)
   */
  const loginViaHardwareWallet = React.useCallback(async () => {
    if (
      !frontendClient ||
      !frontendClientStatus.isInitialized ||
      walletWithSignParams.walletBlockchain === 'OFF_CHAIN'
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
      await loginViaSolanaHardwareWallet(frontendClient, walletWithSignParams);
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
    } finally {
      setIsLoading(false);
    }
    return frontendClient;
  }, [userId, !!frontendClient]);

  if (!frontendClient || !transactionNonce) return null;

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
        loginViaTransaction: {
          nonce: transactionNonce,
          login: loginViaTransaction,
        },
      }}
    >
      {children}
    </NotifiFrontendClientContext.Provider>
  );
};

export const useNotifiFrontendClientContext = () =>
  React.useContext(NotifiFrontendClientContext);
