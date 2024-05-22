import {
  ConfigFactoryInput,
  NotifiEnvironment,
  NotifiFrontendClient,
  WalletWithSignParams,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type FrontendClientStatus = {
  isExpired: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

export type NotifiFrontendClientContextType = {
  frontendClient: NotifiFrontendClient;
  frontendClientStatus: FrontendClientStatus;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
};

export const NotifiFrontendClientContext =
  createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env?: NotifiEnvironment;
} & WalletWithSignParams;

export const NotifiFrontendClientProvider: FC<
  PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({ children, tenantId, env, ...walletWithSignParams }) => {
  const [frontendClient, setFrontendClient] =
    useState<NotifiFrontendClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [frontendClientStatus, setFrontendClientStatus] =
    useState<FrontendClientStatus>({
      isExpired: false,
      isInitialized: false,
      isAuthenticated: false,
    });

  useEffect(() => {
    const configInput = getFrontendConfigInput(
      tenantId,
      env,
      walletWithSignParams,
    );
    const frontendClient = newFrontendClient(configInput);

    setLoading(true);
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
        setError(
          new Error('ERROR: Failed to initialize Notifi frontend client'),
        );
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [walletWithSignParams.walletPublicKey]);

  const login = async () => {
    if (!frontendClient) return;
    // TODO: Implement a more general hardware wallet login frontendClientMethod.
    // if (loginMethod === 'hardwareWallet') { return frontendClient.loginWithHardwareWallet(); }
    setLoading(true);
    try {
      await frontendClient.logIn(walletWithSignParams);
      setFrontendClientStatus({
        isExpired: frontendClient.userState?.status === 'expired',
        isInitialized: !!frontendClient,
        isAuthenticated: frontendClient.userState?.status === 'authenticated',
      });
      setError(null);
    } catch (error) {
      setError(new Error('ERROR: Failed to login'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!frontendClient) return null;

  return (
    <NotifiFrontendClientContext.Provider
      value={{
        frontendClient,
        frontendClientStatus,
        loading,
        error,
        login,
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
  env?: NotifiEnvironment,
  params?: WalletWithSignParams,
): ConfigFactoryInput => {
  if (params && 'accountAddress' in params) {
    return {
      account: {
        address: params.accountAddress,
        publicKey: params.walletPublicKey,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else if (params && 'signingPubkey' in params) {
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
        publicKey: params?.walletPublicKey ?? '',
      },
      tenantId,
      walletBlockchain: params?.walletBlockchain ?? 'AVALANCHE',
      env,
    };
  }
};
