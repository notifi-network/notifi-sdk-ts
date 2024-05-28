import {
  FusionEventTopic,
  FusionFilterOptions,
  UserInputOptions,
  resolveObjectArrayRef,
  resolveStringRef,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  TopicStackAlert,
  convertOptionValue,
  getFusionEventMetadata,
  isAlertFilter,
  isAlertMetadataForTopicStack,
  isFusionFilterOptions,
  resolveAlertName,
  resolveTopicStackAlertName,
} from '../utils';
import { useNotifiFrontendClientContext } from './NotifiFrontendClientContext';
import { useNotifiTenantConfigContext } from './NotifiTenantConfigContext';

export type NotifiTopicContextType = {
  isLoading: boolean;
  error: Error | null;
  subscribeAlertsWithFilterOptions: (
    topicWithFilterOptionsList: ReadonlyArray<{
      topic: FusionEventTopic;
      filterOptions: FusionFilterOptions;
      subscriptionValue?: string;
      customAlertName?: string;
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
  getTopicStackAlertsFromTopicName: (topicName: string) => TopicStackAlert[];
  getTopicStackAlerts: (fusionEventTypeId: string) => TopicStackAlert[];
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
    (alertName: string) => {
      setIsLoading(true);
      const alert = alerts[alertName];
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
    (alertName: string) => {
      return Object.keys(alerts).includes(alertName);
    },
    [alerts],
  );

  const subscribeAlertsWithFilterOptions = async (
    topicWithFilterOptionsList: ReadonlyArray<{
      topic: FusionEventTopic;
      subscriptionValue?: string;
      filterOptions: FusionFilterOptions;
      customAlertName?: string;
    }>,
    targetGroupId: string,
  ) => {
    const createAlertInputs: Types.CreateFusionAlertInput[] = [];
    const alertNamesToCreate: string[] = [];
    topicWithFilterOptionsList.forEach(
      ({ topic, filterOptions, subscriptionValue, customAlertName }) => {
        const fusionEventId = topic.fusionEventDescriptor.id;
        const fusionEventMetadata = getFusionEventMetadata(topic);
        if (!fusionEventMetadata || !fusionEventId) return;
        const legacySubscriptionValue = resolveStringRef(
          topic.uiConfig.name,
          topic.uiConfig.sourceAddress,
          inputs,
        );
        const alertName = customAlertName ?? fusionEventId;
        alertNamesToCreate.push(alertName);
        createAlertInputs.push({
          fusionEventId: fusionEventId,
          name: alertName,
          targetGroupId,
          subscriptionValue: subscriptionValue ?? legacySubscriptionValue,
          filterOptions: JSON.stringify(filterOptions),
        });
      },
    );

    setIsLoading(true);
    // Note: Alert object is immutable, so we need to delete the old one first
    for (const alertName of Object.keys(alerts)) {
      if (alertNamesToCreate.includes(alertName)) {
        const id = alerts[alertName].id;
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
    const alertNamesToCreate: string[] = [];
    topics.forEach((topic) => {
      const fusionEventDescriptor = topic.fusionEventDescriptor;
      const fusionEventMetadataJson = fusionEventDescriptor.metadata;
      const fusionEventId = fusionEventDescriptor.id;
      if (fusionEventMetadataJson && fusionEventId) {
        const fusionEventMetadata = getFusionEventMetadata(topic);
        const filters = fusionEventMetadata?.filters?.filter(isAlertFilter);
        const fusionFilterOptionsInput: FusionFilterOptions['input'] = {};
        if (filters && filters.length > 0) {
          // NOTE: for now we only consider 1 to 1 relationship (1 filter for 1 topic)

          const userInputParams = filters[0].userInputParams;
          const userInputOptions: UserInputOptions = {};
          //TODO: O(n^2) to fix
          userInputParams.forEach((userInputParm) => {
            userInputOptions[userInputParm.name] = convertOptionValue(
              userInputParm.defaultValue,
              userInputParm.kind,
            );
          });
          fusionFilterOptionsInput[filters[0].name] = userInputOptions;
        }
        const filterOptions: FusionFilterOptions = {
          version: 1,
          input: fusionFilterOptionsInput,
        };

        const subscriptionValueOrRef =
          getFusionEventMetadata(topic)?.uiConfigOverride
            ?.subscriptionValueOrRef;
        const subscriptionValue = subscriptionValueOrRef
          ? resolveObjectArrayRef('', subscriptionValueOrRef, inputs)
          : null;

        const legacySubscriptionValue = resolveStringRef(
          topic.uiConfig.name,
          topic.uiConfig.sourceAddress, // NOTE: Deprecated, always the hardcoded '*'
          inputs,
        );

        const alertName = fusionEventId;
        alertNamesToCreate.push(alertName);

        createAlertInputs.push({
          fusionEventId: fusionEventId,
          name: alertName,
          targetGroupId,
          subscriptionValue:
            subscriptionValue?.[0]?.value ?? legacySubscriptionValue,
          filterOptions: JSON.stringify(filterOptions),
        });
      }
    });

    setIsLoading(true);
    // Note: Alert object is immutable, so we need to delete the old one first
    for (const alertName of Object.keys(alerts)) {
      if (alertNamesToCreate.includes(alertName)) {
        const id = alerts[alertName].id;
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

  const getAlertFilterOptions = useCallback(
    (alertName: string) => {
      const parsedFilterOptions = JSON.parse(
        alerts[alertName]?.filterOptions ?? '{}',
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

  /**@deprecated - Use getTopicStackAlerts instead */
  const getTopicStackAlertsFromTopicName = (topicName: string) => {
    return Object.keys(alerts)
      .map((alertName) => {
        // TODO: refactor to use alert.subscriptionValue when endpoint ready
        const resolved = resolveTopicStackAlertName(alertName);

        if (resolved.fusionEventTypeId === topicName) {
          return {
            alertName,
            id: alerts[alertName].id,
            subscriptionValueInfo: {
              label: resolved.subscriptionLabel,
              value: resolved.subscriptionValue,
            },
          };
        }
      })
      .filter(
        (data): data is TopicStackAlert =>
          data !== undefined &&
          'id' in data &&
          'alertName' in data &&
          'subscriptionValueInfo' in data,
      );
  };

  const getTopicStackAlerts = (fusionEventTypeId: string) => {
    return Object.keys(alerts)
      .map((alertName) => {
        const resolved = resolveAlertName(alertName);

        if (
          isAlertMetadataForTopicStack(resolved) &&
          resolved.fusionEventTypeId === fusionEventTypeId
        ) {
          return {
            alertName,
            id: alerts[alertName].id,
            subscriptionValueInfo: {
              label: resolved.subscriptionLabel,
              value: resolved.subscriptionValue,
            },
          };
        }
      })
      .filter(
        (data): data is TopicStackAlert =>
          data !== undefined &&
          'id' in data &&
          'alertName' in data &&
          'subscriptionValueInfo' in data,
      );
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
        getTopicStackAlerts,
        getTopicStackAlertsFromTopicName,
      }}
    >
      {children}
    </NotifiTopicContext.Provider>
  );
};

export const useNotifiTopicContext = () => useContext(NotifiTopicContext);
