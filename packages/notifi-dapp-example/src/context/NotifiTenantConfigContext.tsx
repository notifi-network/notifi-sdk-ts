'use client';

import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type NotifiTenantConfigContextType = {
  isLoading: boolean;
  error: Error | null;
  cardConfig: CardConfigItemV1;
  inputs: Record<string, unknown>; // TODO: deprecate for implement?
};

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
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [cardConfig, setCardConfig] = useState<CardConfigItemV1 | null>(null);

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    setIsLoading(true);

    frontendClient
      .fetchSubscriptionCard({
        id: notifiSubscriptionCardId,
        type: 'SUBSCRIPTION_CARD',
      })
      .then((cardConfig) => {
        if ('version' in cardConfig && cardConfig.version !== 'IntercomV1') {
          setCardConfig(cardConfig);
        }
        setError(null);
      })
      .catch((e) => {
        setError(new Error('Failed to fetch Card Config, please try again'));
        console.error(e);
      })
      .finally(() => setIsLoading(false));

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

  if (!cardConfig) {
    return null;
  }

  return (
    <NotifiTenantConfigContext.Provider
      value={{ cardConfig, inputs, isLoading, error }}
    >
      {children}
    </NotifiTenantConfigContext.Provider>
  );
};

export const useNotifiTenantConfig = () =>
  useContext(NotifiTenantConfigContext);
