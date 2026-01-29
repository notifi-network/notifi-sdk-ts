import {
  CardConfigItemV1,
  CardConfigItemV2,
  FusionEventTopic,
  NotifiError,
  TopicMetadata,
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
  cardConfig: CardConfigItemV1 | CardConfigItemV2 | null;
  fusionEventTopics: ReadonlyArray<FusionEventTopic | TopicMetadata>;
  inputs: Record<string, unknown>;
  isLoading: boolean;
  error: Error | null;
  getFusionTopic: (
    fusionEventId: string,
  ) => FusionEventTopic | TopicMetadata | undefined;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();
  const isInitialLoaded = React.useRef(false);

  const [cardConfig, setCardConfig] = useState<
    CardConfigItemV1 | CardConfigItemV2 | null
  >(null);
  const [fusionEventTopics, setFusionEventTopics] = useState<
    ReadonlyArray<FusionEventTopic | TopicMetadata>
  >([]);
  useEffect(() => {
    if (!frontendClientStatus.isInitialized || isInitialLoaded.current) return;
    isInitialLoaded.current = true;
    setIsLoading(true);

    frontendClient
      .fetchTenantConfig({ id: cardId, type: 'SUBSCRIPTION_CARD' })
      .then(({ cardConfig, fusionEventTopics }) => {
        setCardConfig(cardConfig);
        setFusionEventTopics(fusionEventTopics);
        setError(null);
      })
      .catch((e) => {
        isInitialLoaded.current = false;
        const error = NotifiError.from(e);
        setError({
          ...error,
          message: `Failed to fetch tenant config (.fetchTenantConfig): ${error.message}`,
        });
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  }, [frontendClientStatus]);

  if (!cardConfig) {
    return null;
  }

  const getFusionTopic = (fusionEventId: string) => {
    return fusionEventTopics.find(
      (topic) => topic.fusionEventDescriptor.id === fusionEventId,
    );
  };

  return (
    <NotifiTenantConfigContext.Provider
      value={{
        cardConfig,
        inputs,
        isLoading,
        error,
        fusionEventTopics,
        getFusionTopic,
      }}
    >
      {children}
    </NotifiTenantConfigContext.Provider>
  );
};

export const useNotifiTenantConfigContext = () =>
  useContext(NotifiTenantConfigContext);
