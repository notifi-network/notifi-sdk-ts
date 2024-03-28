'use client';

import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useGlobalStateContext } from './GlobalStateContext';
import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type NotifiTenantConfigContextType = {
  cardConfig: CardConfigItemV1;
  inputs: Record<string, unknown>; // TODO: deprecate for implement?
  ftuStage: FtuStage | null;
  updateFtuStage: (ftuConfigStep: FtuStage) => Promise<void>;
};

export enum FtuStage {
  Destination = 3,
  Alerts = 2,
  Done = 1,
}

const NotifiTenantConfigContext = createContext<NotifiTenantConfigContextType>(
  {} as NotifiTenantConfigContextType,
);

const notifiSubscriptionCardId =
  process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

type NotifiTenantConfigProps = {
  inputs?: Record<string, unknown>;
};

export const NotifiTenantConfigContextProvider: FC<
  PropsWithChildren<NotifiTenantConfigProps>
> = ({ inputs = {}, children }) => {
  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const [cardConfig, setCardConfig] = useState<CardConfigItemV1 | null>(null);
  const [ftuStage, setFtuStage] = useState<FtuStage | null>(null);

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    setIsGlobalLoading(true);
    frontendClient
      .fetchSubscriptionCard({
        id: notifiSubscriptionCardId,
        type: 'SUBSCRIPTION_CARD',
      })
      .then((cardConfig) => {
        if ('version' in cardConfig && cardConfig.version !== 'IntercomV1') {
          // 1. Update card config
          setCardConfig(cardConfig);
        }
      })
      .catch((e) => {
        setGlobalError('ERROR: Failed to fetch Card Config, please try again');
        console.log(e);
      })
      .finally(() => setIsGlobalLoading(false));

    // TODO: Also fetch fusion events (When `User` role is allowed to fetch fusion events)
    // const [fusionEvents, setFusionEvents] =
    //   useState<Types.GetFusionEventsQuery['fusionEvents']>();
    // const cardConfigPromise = frontendClient.fetchSubscriptionCard({
    //   id: notifiSubscriptionCardId,
    //   type: 'SUBSCRIPTION_CARD',
    // });

    // const fusionEventsPromise = frontendClient.getFusionEvents({});

    // Promise.all([cardConfigPromise, fusionEventsPromise])
    //   .then(([cardConfig, fusionEvents]) => {
    //     console.log({ cardConfig, fusionEvents });
    //     if ('version' in cardConfig && cardConfig.version !== 'IntercomV1') {
    //       setCardConfig(cardConfig);
    //     }
    //     setFusionEvents(fusionEvents);
    //   })
    //   .catch((e) => {
    //     setGlobalError(
    //       'ERROR: Failed to fetch Card Config or Fusion Events, see console for more details.',
    //     );
    //     console.log(e);
    //   })
    //   .finally(() => setIsGlobalLoading(false));
  }, [frontendClient]);

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return;
    frontendClient.getUserSettings().then((userSettings) => {
      if (!userSettings?.ftuStage) {
        if (cardConfig?.isContactInfoRequired) {
          return updateFtuStage(FtuStage.Destination);
        }
        return updateFtuStage(FtuStage.Alerts);
      }
      setFtuStage(userSettings.ftuStage);
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

  if (!cardConfig) {
    return null;
  }

  return (
    <NotifiTenantConfigContext.Provider
      value={{ cardConfig, inputs, ftuStage, updateFtuStage }}
    >
      {children}
    </NotifiTenantConfigContext.Provider>
  );
};

export const useNotifiTenantConfig = () =>
  useContext(NotifiTenantConfigContext);
