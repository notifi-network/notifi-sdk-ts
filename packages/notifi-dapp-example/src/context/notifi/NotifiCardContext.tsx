'use client';

import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useGlobalStateContext } from '../GlobalStateContext';

export type NotifiCardContextType = {
  cardConfig: CardConfigItemV1;
  inputs: Record<string, unknown>;
};

const NotifiCardContext = createContext<NotifiCardContextType>(
  {} as NotifiCardContextType,
);

const notifiSubscriptionCardId =
  process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

type NotifiCardProps = {
  inputs?: Record<string, unknown>;
};

export const NotifiCardContextProvider: FC<
  PropsWithChildren<NotifiCardProps>
> = ({ inputs = {}, children }) => {
  const { frontendClient } = useNotifiClientContext();
  const [cardConfig, setCardConfig] = useState<CardConfigItemV1 | null>(null);
  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();

  useEffect(() => {
    setIsGlobalLoading(true);
    frontendClient
      .fetchSubscriptionCard({
        id: notifiSubscriptionCardId,
        type: 'SUBSCRIPTION_CARD',
      })
      .then((cardConfig) => {
        if ('version' in cardConfig && cardConfig.version !== 'IntercomV1') {
          setCardConfig(cardConfig);
        }
      })
      .catch((e) => {
        setGlobalError(
          'ERROR: Failed to fetch Card Config, see console for more details.',
        );
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

  if (!cardConfig) {
    return null;
  }

  return (
    <NotifiCardContext.Provider value={{ cardConfig, inputs }}>
      {children}
    </NotifiCardContext.Provider>
  );
};

export const useNotifiCardContext = () => useContext(NotifiCardContext);
