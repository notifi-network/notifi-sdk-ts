import {
  FusionEventTopic,
  FusionFilterOptions,
  TopicMetadata,
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

export type TopicWithFilterOption = {
  topic: FusionEventTopic | TopicMetadata;
  filterOptions: FusionFilterOptions;
  subscriptionValue?: string;
  customAlertName?: string;
};

export type NotifiTopicContextType = {
  isLoading: boolean;
  error: Error | null;
  subscribeAlertsWithFilterOptions: (
    topicWithFilterOptionsList: ReadonlyArray<TopicWithFilterOption>,
    targetGroupId: string,
  ) => Promise<void>;
  subscribeAlertsDefault: (
    /* Subscribe in default value */
    topics: ReadonlyArray<FusionEventTopic | TopicMetadata>,
    targetGroupId: string,
  ) => Promise<void>;

  unsubscribeAlerts: (topicNames: string[]) => void;
  isAlertSubscribed: (topicName: string) => boolean;
  getAlertFilterOptions: (topicName: string) => FusionFilterOptions | null;
  getTopicStackAlerts: (fusionEventTypeId: string) => TopicStackAlert[];
  /**@deprecated Use unsubscribeAlerts instead */
  unsubscribeAlert: (topicName: string) => void;
  /**@deprecated Use getTopicStackAlerts instead */
  getTopicStackAlertsFromTopicName: (topicName: string) => TopicStackAlert[];
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
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<
    Record<string, Types.AlertFragmentFragment>
  >({});
  const isInitialLoaded = React.useRef(false);

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated || isInitialLoaded.current)
      return;
    isInitialLoaded.current = true;
    frontendClient
      .fetchFusionData()
      .then(refreshAlerts)
      .catch(() => (isInitialLoaded.current = false))
      .finally(() => setIsLoading(false));
  }, [frontendClientStatus.isAuthenticated]);

  /**
   * @deprecated Use unsubscribeAlerts instead
   */
  const unsubscribeAlert = useCallback(
    (alertName: string) => {
      setIsLoading(true);
      const alert = alerts[alertName];
      if (!alert) return;
      frontendClient
        .deleteAlert({ id: alert.id })
        .then(() => {
          frontendClient.fetchFusionData().then(refreshAlerts);
          setError(null);
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => setIsLoading(false));
    },
    [alerts, frontendClient],
  );

  const unsubscribeAlerts = useCallback(
    async (alertNames: string[]) => {
      setIsLoading(true);
      const alertIds = alertNames.map((alertName) => alerts[alertName]?.id);
      try {
        await frontendClient.deleteAlerts({ ids: alertIds });
        const data = await frontendClient.fetchFusionData();
        refreshAlerts(data);
        setError(null);
      } catch (e) {
        if (e instanceof Error) setError(e);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
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
      topic: FusionEventTopic | TopicMetadata;
      subscriptionValue?: string;
      filterOptions: FusionFilterOptions;
      customAlertName?: string;
    }>,
    targetGroupId: string,
  ) => {
    const createAlertInputs: Types.CreateFusionAlertInput[] = [];
    const alertNamesToCreate: string[] = [];
    topicWithFilterOptionsList.forEach(
      ({ topic, filterOptions, customAlertName, subscriptionValue }) => {
        const fusionEventId = topic.fusionEventDescriptor.id;
        const fusionEventMetadata = getFusionEventMetadata(topic);
        if (!fusionEventMetadata || !fusionEventId) return;
        try {
          /** Error caught here often caused by incorrect `inputs` format  */
          if (!subscriptionValue) {
            const subscriptionValueOrRef =
              getFusionEventMetadata(topic)?.uiConfigOverride
                ?.subscriptionValueOrRef;
            const subscriptionValueObject = subscriptionValueOrRef
              ? [...resolveObjectArrayRef('', subscriptionValueOrRef, inputs)]
              : null;
            subscriptionValue = subscriptionValueObject?.[0]?.value;
          }
          const legacySubscriptionValue = resolveStringRef(
            topic.uiConfig.name,
            'sourceAddress' in topic.uiConfig
              ? topic.uiConfig.sourceAddress // V1 tenant metadata --> Deprecated, always the hardcoded '*'
              : { type: 'value', value: '*' }, // fallback to '*' when neither sourceAddress nor subscriptionValueOrRef is provided
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
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            const error = {
              ...e,
              message: `Cannot resolve subscription value. Make sure "inputs" argument is in correct format. ${e.message}`,
            };
            setError(error);
          }
        }
      },
    );

    setIsLoading(true);
    // Note: Alert object is immutable, so we need to delete the old one first
    const alertIds = Object.keys(alerts)
      .filter((alertName) => alertNamesToCreate.includes(alertName))
      .map((alertName) => alerts[alertName].id);

    if (alertIds.length > 0) {
      try {
        await frontendClient.deleteAlerts({ ids: alertIds });
      } catch (e) {
        if (e instanceof Error)
          setError({ ...e, message: `Failed to del. existing. ${e.message}` });
        console.error(e);
        return setIsLoading(false);
      }
    }

    try {
      await frontendClient.ensureFusionAlerts({ alerts: createAlertInputs });
      const data = await frontendClient.fetchFusionData();
      refreshAlerts(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeAlertsDefault = async (
    topics: ReadonlyArray<FusionEventTopic | TopicMetadata>,
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
        // NOTE: stackable topics does not support default subscription
        if (fusionEventMetadata?.uiConfigOverride?.isSubscriptionValueInputable)
          return;
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
        try {
          /** Error caught here often caused by incorrect `inputs` format  */
          const subscriptionValueOrRef =
            getFusionEventMetadata(topic)?.uiConfigOverride
              ?.subscriptionValueOrRef;
          const subscriptionValue = subscriptionValueOrRef
            ? resolveObjectArrayRef('', subscriptionValueOrRef, inputs)
            : null;

          // NOTE: For backward compatibility (v1 tenant config)
          const legacySubscriptionValue = resolveStringRef(
            topic.uiConfig.name,
            'sourceAddress' in topic.uiConfig
              ? topic.uiConfig.sourceAddress // V1 tenant metadata --> Deprecated, always the hardcoded '*'
              : { type: 'value', value: '*' }, // fallback to '*' when neither sourceAddress nor subscriptionValueOrRef is provided
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
        } catch (e) {
          console.error(e);
          if (e instanceof Error) {
            const error = {
              ...e,
              message: `Cannot resolve subscription value. Make sure "inputs" argument is in correct format. ${e.message}`,
            };
            setError(error);
          }
        }
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
      const data = await frontendClient.fetchFusionData();
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

  const refreshAlerts = (newData: Types.FetchFusionDataQuery) => {
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
        const resolved = resolveTopicStackAlertName(alertName);

        if (resolved.fusionEventTypeId === topicName) {
          return {
            alertName,
            id: alerts[alertName].id,
            subscriptionValueInfo: {
              label: resolved.subscriptionLabel,
              value: resolved.subscriptionValue,
            },
            filterOptions: getAlertFilterOptions(alertName),
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
            filterOptions: getAlertFilterOptions(alertName),
          };
        }
      })
      .filter(
        (data): data is TopicStackAlert =>
          data !== undefined &&
          'id' in data &&
          'alertName' in data &&
          'subscriptionValueInfo' in data &&
          'filterOptions' in data,
      );
  };

  return (
    <NotifiTopicContext.Provider
      value={{
        isLoading,
        error,
        subscribeAlertsDefault,
        isAlertSubscribed,
        subscribeAlertsWithFilterOptions,
        getAlertFilterOptions,
        getTopicStackAlerts,
        unsubscribeAlerts,
        unsubscribeAlert,
        getTopicStackAlertsFromTopicName,
      }}
    >
      {children}
    </NotifiTopicContext.Provider>
  );
};

export const useNotifiTopicContext = () => useContext(NotifiTopicContext);
