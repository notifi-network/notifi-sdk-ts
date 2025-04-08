import {
  AuthParams,
  type ExecuteSmartLinkActionArgs,
  type NotifiEnvironment,
  NotifiSmartLinkClient,
  type SmartLinkConfig,
  newSmartLinkClient,
} from '@notifi-network/notifi-frontend-client';
import React, { FC, PropsWithChildren } from 'react';

type NotifiSmartLinkContextType = {
  fetchSmartLinkConfig: (
    id: string,
  ) => Promise<{ smartLinkConfig: SmartLinkConfig; isActive: boolean } | null>;
  executeSmartLinkAction: (args: ExecuteSmartLinkActionArgs) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

const NotifiSmartLinkContext = React.createContext<NotifiSmartLinkContextType>(
  {} as NotifiSmartLinkContextType /** Intentionally empty */,
);

type NotifiSmartLinkContextProps = {
  env?: NotifiEnvironment;
  authParams: AuthParams;
};

export const NotifiSmartLinkContextProvider: FC<
  PropsWithChildren<NotifiSmartLinkContextProps>
> = ({ authParams, children, env = 'Production' }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const [smartLinkClient, setSmartLinkClient] =
    React.useState<NotifiSmartLinkClient | null>(null);

  React.useEffect(() => {
    const smartLinkClient = newSmartLinkClient({ env, authParams });
    setSmartLinkClient(smartLinkClient);
  }, [authParams]);

  const fetchSmartLinkConfig = React.useCallback(
    async (id: string) => {
      if (!smartLinkClient) {
        const error = new Error('SmartLinkClient is not initialized');
        setError(error);
        return null;
      }

      try {
        setIsLoading(true);
        const smartLinkConfigWithIsActive =
          await smartLinkClient.fetchSmartLinkConfig(id);
        setError(null);
        return smartLinkConfigWithIsActive;
      } catch (e) {
        setError(e as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [smartLinkClient],
  );

  const executeSmartLinkAction = React.useCallback(
    async (args: ExecuteSmartLinkActionArgs) => {
      if (!smartLinkClient) {
        const error = new Error('NotifiSmartLinkClient is not initialized');
        setError(error);
        return;
      }
      try {
        setIsLoading(true);
        await smartLinkClient.executeSmartLinkAction(args);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [smartLinkClient],
  );

  return (
    <NotifiSmartLinkContext.Provider
      value={{
        fetchSmartLinkConfig,
        executeSmartLinkAction,
        isLoading,
        error,
      }}
    >
      {children}
    </NotifiSmartLinkContext.Provider>
  );
};

export const useNotifiSmartLinkContext = () =>
  React.useContext(NotifiSmartLinkContext);
