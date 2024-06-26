import {
  CardConfigItemV1,
  FusionEventTopic,
} from '@notifi-network/notifi-frontend-client';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';

export type NotifiTenantConfigContextType = {
  cardConfig: CardConfigItemV1 | null;
  fusionEventTopics: ReadonlyArray<FusionEventTopic>;
  inputs: Record<string, unknown>;
  isLoading: boolean;
  error: Error | null;
};

const NotifiTenantConfigContext = createContext<NotifiTenantConfigContextType>(
  {} as NotifiTenantConfigContextType,
);

export type NotifiTenantConfigProps = {
  inputs?: Record<string, unknown>;
  cardId: string;
};

export const NotifiTenantConfigContextProvider: FC<
  PropsWithChildren<NotifiTenantConfigProps>
> = ({ inputs = {}, children, cardId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();

  const [cardConfig, setCardConfig] = useState<CardConfigItemV1 | null>(null);
  const [fusionEventTopics, setFusionEventTopics] = useState<
    ReadonlyArray<FusionEventTopic>
  >([]);
  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    setIsLoading(true);

    frontendClient
      .fetchTenantConfig({ id: cardId, type: 'SUBSCRIPTION_CARD' })
      .then(({ cardConfig, fusionEventTopics }) => {
        setCardConfig(cardConfig);
        setFusionEventTopics(fusionEventTopics);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setIsLoading(false));
  }, [frontendClientStatus]);

  if (!cardConfig) {
    return null;
  }

  return (
    <NotifiTenantConfigContext.Provider
      value={{ cardConfig, inputs, isLoading, error, fusionEventTopics }}
    >
      {children}
    </NotifiTenantConfigContext.Provider>
  );
};

export const useNotifiTenantConfigContext = () =>
  useContext(NotifiTenantConfigContext);
