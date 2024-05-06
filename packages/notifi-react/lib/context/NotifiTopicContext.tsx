import {
  Filter,
  FusionEventMetadata,
  FusionEventTopic,
  FusionFilterOptions,
  UserInputOptions,
  resolveStringRef,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { isAlertFilter, isFusionFilterOptions } from 'notifi-react/utils/topic';
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
import { useNotifiTenantConfigContext } from './NotifiTenantConfigContext';

export type NotifiTopicContextType = {
  isLoading: boolean;
  error: Error | null;
  subscribeAlertsWithFilterOptions: (
    topicWithFilterOptionsList: ReadonlyArray<{
      topic: FusionEventTopic;
      filterOptions: FusionFilterOptions;
    }>,
    targetGroupId: string,
  ) => Promise<void>;
  subscribeAlertsDefault: (
    /* Subscribe in default value */
    topics: ReadonlyArray<FusionEventTopic>,
    targetGroupId: string,
  ) => Promise<void>;
  unsubscribeAlert: (topicName: string) => void;
  isAlertSubscribed: (topicName: string) => boolean;
  getAlertFilterOptions: (topicName: string) => FusionFilterOptions | null;
};

const NotifiTopicContext = createContext<NotifiTopicContextType>(
  {} as NotifiTopicContextType, // intentionally empty as initial value
);

/**
 * @description Two important Notifi concepts: `Topic` and `Alert`.
 * - `Topic` is the event allowed to be subscribed (Tenant specific). => FusionEventTopic
 * - `Alert` is the subscription of the `Topic` (User specific). => Types.AlertFragmentFragment
 * Once a user subscribes to a `Topic`, he/she will has an `Alert` object.
 */

export const NotifiTopicContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { inputs } = useNotifiTenantConfigContext();
  const [error, setError] = useState<Error | null>(null);
  const { frontendClient, frontendClientStatus } =
    useNotifiFrontendClientContext();
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<
    Record<string, Types.AlertFragmentFragment>
  >({});

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return;
    frontendClient.fetchData().then(refreshAlerts);
  }, [frontendClientStatus.isAuthenticated]);

  const unsubscribeAlert = useCallback(
    (topicName: string) => {
      setIsLoading(true);
      const alert = alerts[topicName];
      if (!alert) return;
      frontendClient
        .deleteAlert({ id: alert.id })
        .then(() => {
          frontendClient.fetchData().then(refreshAlerts);
          setError(null);
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => setIsLoading(false));
    },
    [alerts, frontendClient],
  );

  const isAlertSubscribed = useCallback(
    (topicName: string) => {
      return Object.keys(alerts).includes(topicName);
    },
    [alerts],
  );

  const subscribeAlertsWithFilterOptions = async (
    topicWithFilterOptionsList: ReadonlyArray<{
      topic: FusionEventTopic;
      filterOptions: FusionFilterOptions;
    }>,
    targetGroupId: string,
  ) => {
    const createAlertInputs: Types.CreateFusionAlertInput[] = [];
    topicWithFilterOptionsList.forEach(({ topic, filterOptions }) => {
      const fusionEventDescriptor = topic.fusionEventDescriptor;
      const fusionEventMetadataJson = fusionEventDescriptor.metadata;
      const fusionEventId = fusionEventDescriptor.id;
      // TODO: validate if metadata & fitlerOptions are matched
      if (!fusionEventMetadataJson || !fusionEventId) return;
      const subscriptionValue = resolveStringRef(
        topic.uiConfig.name,
        topic.uiConfig.sourceAddress, // TODO:
        inputs,
      );
      createAlertInputs.push({
        fusionEventId: fusionEventId,
        name: topic.uiConfig.name,
        targetGroupId,
        subscriptionValue,
        filterOptions: JSON.stringify(filterOptions),
      });
    });

    setIsLoading(true);
    // Note: Alert object is immutable, so we need to delete the old one first
    // TODO:  extract as private util function
    for (const topicWithFilterOptions of topicWithFilterOptionsList) {
      if (isAlertSubscribed(topicWithFilterOptions.topic.uiConfig.name)) {
        const id = alerts[topicWithFilterOptions.topic.uiConfig.name].id;
        try {
          await frontendClient.deleteAlert({ id });
        } catch (e) {
          /* Intentionally left blank */
        }
      }
    }

    try {
      await frontendClient.ensureFusionAlerts({ alerts: createAlertInputs });
      const data = await frontendClient.fetchData();
      refreshAlerts(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeAlertsDefault = async (
    topics: ReadonlyArray<FusionEventTopic>,
    targetGroupId: string,
  ) => {
    const createAlertInputs: Types.CreateFusionAlertInput[] = [];
    topics.forEach((topic) => {
      const fusionEventDescriptor = topic.fusionEventDescriptor;
      const fusionEventMetadataJson = fusionEventDescriptor.metadata;
      const fusionEventId = fusionEventDescriptor.id;
      if (fusionEventMetadataJson && fusionEventId) {
        // TODO: might need impl validator for metadata
        const fusionEventMetadata = JSON.parse(
          fusionEventMetadataJson,
        ) as FusionEventMetadata;
        const filters = (fusionEventMetadata.filters as Filter[])?.filter(
          isAlertFilter,
        );
        const fusionFilterOptionsInput: FusionFilterOptions['input'] = {};

        if (filters && filters.length > 0) {
          // NOTE: for now we only consider 1 to 1 relationship (1 filter for 1 topic)

          const userInputParams = filters[0].userInputParams;
          const userInputOptions: UserInputOptions = {};
          //TODO: O(n^2) to fix
          userInputParams.forEach((userInput) => {
            userInputOptions[userInput.name] = userInput.defaultValue;
          });
          fusionFilterOptionsInput[filters[0].name] = userInputOptions;
        }
        const filterOptions: FusionFilterOptions = {
          version: 1,
          input: fusionFilterOptionsInput,
        };

        const subscriptionValue = resolveStringRef(
          topic.uiConfig.name,
          topic.uiConfig.sourceAddress, // TODO: AP not yet able to set input reference
          inputs,
        );

        createAlertInputs.push({
          fusionEventId: fusionEventId,
          name: topic.uiConfig.name,
          targetGroupId,
          subscriptionValue,
          filterOptions: JSON.stringify(filterOptions),
        });
      }
    });

    try {
      await frontendClient.ensureFusionAlerts({ alerts: createAlertInputs });
      const data = await frontendClient.fetchData();
      refreshAlerts(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAlertFilterOptions = useCallback(
    (topicName: string) => {
      const parsedFilterOptions = JSON.parse(
        alerts[topicName]?.filterOptions ?? '{}',
      );
      return isFusionFilterOptions(parsedFilterOptions)
        ? parsedFilterOptions
        : null;
    },
    [alerts],
  );

  const refreshAlerts = (newData: Types.FetchDataQuery) => {
    const alerts: Record<string, Types.AlertFragmentFragment> = {};
    newData.alert?.forEach((alert) => {
      if (alert?.name) {
        alerts[alert.name] = alert;
      }
    });
    setAlerts(alerts);
  };

  return (
    <NotifiTopicContext.Provider
      value={{
        isLoading,
        error,
        subscribeAlertsDefault,
        unsubscribeAlert,
        isAlertSubscribed,
        subscribeAlertsWithFilterOptions,
        getAlertFilterOptions,
      }}
    >
      {children}
    </NotifiTopicContext.Provider>
  );
};

export const useNotifiTopicContext = () => useContext(NotifiTopicContext);
