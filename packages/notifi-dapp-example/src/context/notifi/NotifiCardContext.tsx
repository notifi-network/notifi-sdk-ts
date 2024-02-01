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
};

const NotifiCardContext = createContext<NotifiCardContextType>(
  {} as NotifiCardContextType,
);

const notifiSubscriptionCardId =
  process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

export const NotifiCardContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { frontendClient } = useNotifiClientContext();
  const [cardConfig, setCardConfig] = useState<CardConfigItemV1 | null>(null);
  const { setIsGlobalLoading } = useGlobalStateContext();

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
        console.log('TODO: global error state');
      })
      .finally(() => setIsGlobalLoading(false));
  }, [frontendClient]);

  if (!cardConfig) {
    return null;
  }

  return (
    <NotifiCardContext.Provider value={{ cardConfig }}>
      {children}
    </NotifiCardContext.Provider>
  );
};

export const useNotifiCardContext = () => useContext(NotifiCardContext);
