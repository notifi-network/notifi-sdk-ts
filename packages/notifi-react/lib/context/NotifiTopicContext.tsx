import {
  AlertFilter,
  EventTypeItem,
  Filter,
  FusionEventMetadata,
  FusionEventTopic,
  FusionEventTypeItem,
  FusionFilterOptions,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
  UserInputOptions,
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
    });
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
        const filters = fusionEventMetadata.filters;
        const fusionFilterOptionsInput: FusionFilterOptions['input'] = {};
        const filterOptionsList: FusionFilterOptions[] = [];
        if (filters && filters.length > 0) {
          filters.filter(isAlertFilter).forEach((filter) => {
            const userInputParams = filter.userInputParams;
            const userInputOptions: UserInputOptions = {};
            //TODO: O(n^2) to fix
            userInputParams.forEach((userInput) => {
              userInputOptions[userInput.name] = userInput.defaultValue;
            });
            fusionFilterOptionsInput[filter.name] = userInputOptions;
            const filterOptions: FusionFilterOptions = {
              input: fusionFilterOptionsInput,
            };
            filterOptionsList.push(filterOptions);
          });
        }

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
          filterOptions: JSON.stringify(filterOptionsList),
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

  const isAlertSubscribed = useCallback(
    (topicName: string) => {
      return Object.keys(alerts).includes(topicName);
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
      }}
    >
      {children}
    </NotifiTopicContext.Provider>
  );
};

export const useNotifiTopicContext = () => useContext(NotifiTopicContext);

// Utilities
export type LabelWithSubTopicsEventTypeItem = LabelEventTypeItem & {
  subTopics: Array<FusionToggleEventTypeItem>;
};

type ValidTypeItem = FusionToggleEventTypeItem | LabelEventTypeItem;

const validateEventType = (
  eventType: EventTypeItem,
): eventType is ValidTypeItem => {
  // NOTE: now only support toggle fusion event type.
  // TODO: allow dynamic UI components based on fusionEventData.metadata
  return (
    (eventType.type === 'fusion' && eventType.selectedUIType === 'TOGGLE') ||
    eventType.type === 'label'
  );
};

export const categorizeTopics = (
  topics: ReadonlyArray<EventTypeItem>,
  unCategorizedTopicsLabelName?: string,
) => {
  const categorizedEventTypeItems: LabelWithSubTopicsEventTypeItem[] = [];
  const uncategorizedEventTypeItem: LabelWithSubTopicsEventTypeItem = {
    name: unCategorizedTopicsLabelName ?? 'General',
    type: 'label',
    subTopics: [],
  };
  let currentLabel: LabelWithSubTopicsEventTypeItem | undefined = undefined;
  topics.filter(validateEventType).forEach((row) => {
    if (row.type === 'label') {
      currentLabel = {
        ...row,
        subTopics: [],
      };
      categorizedEventTypeItems.push(currentLabel);
    } else {
      if (currentLabel) {
        currentLabel.subTopics.push(row);
      } else {
        uncategorizedEventTypeItem.subTopics.push(row);
      }
    }
  });
  return {
    categorizedTopics: categorizedEventTypeItems,
    uncategorizedTopics: uncategorizedEventTypeItem,
  };
};

export const isAlertFilter = (filter: Filter): filter is AlertFilter => {
  return 'userInputParams' in filter;
};

// TODO: REMOVE after MVP-4329 merged
// Only support fusion event type
export const validateTopic = (
  topic: EventTypeItem,
): topic is FusionEventTypeItem => {
  return topic.type === 'fusion';
};
