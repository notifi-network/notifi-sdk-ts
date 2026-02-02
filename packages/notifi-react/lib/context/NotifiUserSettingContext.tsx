import { NotifiError } from '@notifi-network/notifi-frontend-client';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export enum FtuStage {
  Destination = 3,
  Alerts = 2,
  Done = 1,
}

export type NotifiUserSettingContextType = {
  ftuStage: FtuStage | null;
  updateFtuStage: (ftuConfigStep: FtuStage) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

const NotifiUserSettingContext = createContext<NotifiUserSettingContextType>(
  {} as NotifiUserSettingContextType,
);

export const NotifiUserSettingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { frontendClientStatus, frontendClient } =
    useNotifiFrontendClientContext();

  const [ftuStage, setFtuStage] = useState<FtuStage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialLoaded = React.useRef(false);

  useEffect(() => {
    if (frontendClientStatus.isAuthenticated && !isInitialLoaded.current) {
      if (isLoading && isInitialLoaded.current) return;
      isInitialLoaded.current = true;
      setIsLoading(true);
      frontendClient
        .getUserSettings()
        .then((userSettings) => {
          setFtuStage(userSettings?.ftuStage ?? null);
        })
        .catch((e) => {
          const error = NotifiError.from(e);
          setError({
            ...error,
            message: `Failed to fetch user settings (.getUserSettings): ${error.message}`,
          });
          console.error(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [frontendClientStatus.isAuthenticated]);

  const updateFtuStage = useCallback(
    async (ftuConfigStep: FtuStage) => {
      setIsLoading(true);
      try {
        await frontendClient.updateUserSettings({
          input: { ftuStage: ftuConfigStep },
        });
        setFtuStage(ftuConfigStep);
      } catch (err) {
        setError(NotifiError.from(err));
      } finally {
        setIsLoading(false);
      }
    },
    [frontendClient?.auth.userState?.status],
  );
  return (
    <NotifiUserSettingContext.Provider
      value={{ ftuStage, updateFtuStage, isLoading, error }}
    >
      {children}
    </NotifiUserSettingContext.Provider>
  );
};

export const useNotifiUserSettingContext = () =>
  useContext(NotifiUserSettingContext);
