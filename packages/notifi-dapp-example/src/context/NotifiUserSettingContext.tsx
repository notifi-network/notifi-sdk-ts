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

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return;
    frontendClient.getUserSettings().then((userSettings) => {
      setFtuStage(userSettings?.ftuStage ?? null);
    });
  }, [frontendClientStatus.isAuthenticated]);

  const updateFtuStage = useCallback(
    async (ftuConfigStep: FtuStage) => {
      await frontendClient.updateUserSettings({
        input: { ftuStage: ftuConfigStep },
      });
      setFtuStage(ftuConfigStep);
    },
    [frontendClient?.userState?.status],
  );
  return (
    <NotifiUserSettingContext.Provider value={{ ftuStage, updateFtuStage }}>
      {children}
    </NotifiUserSettingContext.Provider>
  );
};

export const useNotifiUserSettingContext = () =>
  useContext(NotifiUserSettingContext);
