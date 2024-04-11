import {
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

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return setIsLoading(false);
    setIsLoading(true);
    frontendClient
      .getUserSettings()
      .then((userSettings) => {
        setFtuStage(userSettings?.ftuStage ?? null);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
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
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [frontendClient?.userState?.status],
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
