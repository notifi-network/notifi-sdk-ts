import {
  NotifiEnvironment,
  NotifiFrontendClient,
  WalletWithSignParams,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  SolanaParams,
  SolanaParamsWithHardwareLoginPlugin,
  getFrontendConfigInput,
  loginViaSolanaHardwareWallet,
} from '../utils';

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
  loginViaHardwareWallet: () => Promise<NotifiFrontendClient | undefined>;
  walletWithSignParams: WalletWithSignParamsModified;
  nonceForTransactionLogin: string;
  loginViaTransaction: (
    signatureSignedWithNotifiNonce: string,
  ) => Promise<NotifiFrontendClient | undefined>;
};

export const NotifiFrontendClientContext =
  createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

// NOTE: The Utils type for Solana hardware wallet login specifically
type WalletWithSignParamsWoSolana = Exclude<WalletWithSignParams, SolanaParams>;

export type WalletWithSignParamsModified =
  | WalletWithSignParamsWoSolana
  | SolanaParamsWithHardwareLoginPlugin;

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env?: NotifiEnvironment;
} & WalletWithSignParamsModified;

export const NotifiFrontendClientContextProvider: FC<
  PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({ children, tenantId, env, ...walletWithSignParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactionNonce, setTransactionNonce] = useState<string | null>(null);
  const [frontendClient, setFrontendClient] =
    useState<NotifiFrontendClient | null>(null);
  const [frontendClientStatus, setFrontendClientStatus] =
    useState<FrontendClientStatus>({
      isExpired: false,
      isInitialized: false,
      isAuthenticated: false,
    });

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
  }, [walletWithSignParams.walletPublicKey]);

  useEffect(() => {
    if (!frontendClient || !frontendClientStatus.isInitialized) return;
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
    if (!frontendClient) return;
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

  const loginViaTransaction = async (
    signatureSignedWithNotifiNonce: string,
  ) => {
    if (!frontendClient) return;
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
      console.log(4, 'loginViaTransaction success');
      setFrontendClient(frontendClient);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        const newError = {
          ...error,
          message: `loginViaTrasaction: User rejects to sign, or mis-impl the signMessage method: ${error.message}`,
        };
        setError(newError);
        console.error(newError);
      }
    } finally {
      setIsLoading(false);
    }

    return frontendClient;
  };

  /**
   * @description - Only Solana hardware wallet requires a transaction login (rather than signing a message). Reason: MEMO program requires a transaction to verify user's ownership (Ref: https://spl.solana.com/memo)
   */
  const loginViaHardwareWallet = async () => {
    if (!frontendClient) return;
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
  };

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
        nonceForTransactionLogin: transactionNonce,
        loginViaTransaction,
      }}
    >
      {children}
    </NotifiFrontendClientContext.Provider>
  );
};

export const useNotifiFrontendClientContext = () =>
  useContext(NotifiFrontendClientContext);
