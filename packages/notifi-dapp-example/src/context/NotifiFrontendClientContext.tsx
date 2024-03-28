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

import { useGlobalStateContext } from './GlobalStateContext';

export type FrontendClientStatus = {
  isExpired: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

export type NotifiFrontendClientContextType = {
  frontendClient: NotifiFrontendClient;
  frontendClientStatus: FrontendClientStatus;
  loading: boolean;
  login: () => Promise<void>;
};

export const NotifiFrontendClientContext =
  createContext<NotifiFrontendClientContextType>(
    {} as NotifiFrontendClientContextType,
  );

export type NotifiFrontendClientProviderProps = {
  tenantId: string;
  env: NotifiEnvironment;
} & WalletWithSignParams;

export const NotifiFrontendClientProvider: FC<
  PropsWithChildren<NotifiFrontendClientProviderProps>
> = ({ children, tenantId, env, ...walletWithSignParams }) => {
  const { setIsGlobalLoading, popGlobalInfoModal } = useGlobalStateContext();
  const [frontendClient, setFrontendClient] =
    useState<NotifiFrontendClient | null>(null);
  const [loading, setLoading] = useState(true);
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

    setIsGlobalLoading(true);
    frontendClient
      .initialize()
      .then(() => {
        setFrontendClientStatus({
          isExpired: frontendClient.userState?.status === 'expired',
          isInitialized: !!frontendClient,
          isAuthenticated: frontendClient.userState?.status === 'authenticated',
        });
        setFrontendClient(frontendClient);
        popGlobalInfoModal(null);
      })
      .catch((error) => {
        popGlobalInfoModal({
          message: 'ERROR: Failed to initialize Notifi frontend client',
          iconOrEmoji: { type: 'icon', id: 'warning' },
          timeout: 5000,
        });
        console.log(error);
      })
      .finally(() => setIsGlobalLoading(false));
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
    } catch (error) {
      popGlobalInfoModal({
        message: 'ERROR: Failed to login',
        iconOrEmoji: { type: 'icon', id: 'warning' },
        timeout: 5000,
      });
      console.log(error);
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
  env: NotifiEnvironment,
  params: WalletWithSignParams,
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
