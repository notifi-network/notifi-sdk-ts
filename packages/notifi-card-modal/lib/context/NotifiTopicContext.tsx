import {
  EventTypeItem,
  FusionEventTopic,
  FusionEventTypeItem,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
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
import { useNotifiTenantConfig } from './NotifiTenantConfigContext';

export type NotifiTopicContextType = {
  isLoading: boolean;
  error: Error | null;
  // subscribeAlert: (topic: EventTypeItem) => void;
  subscribeFusionAlerts: (
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
  const { inputs } = useNotifiTenantConfig();
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
          // setGlobalError('ERROR: Fail to unsubscribe alert, plase try again.');
          // console.log(e);
          setError(e);
        })
        .finally(() => setIsLoading(false));
    },
    [alerts, frontendClient],
  );

  const subscribeFusionAlerts = async (
    topics: ReadonlyArray<FusionEventTopic>,
    targetGroupId: string,
  ) => {
    // const targetGroupId = targetDocument?.targetGroupId;
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
        filters.forEach((filter) => {
          const userInputParams = filter.userInputParams;
          const userInputOptions: UserInputOptions = {};
          // O(n^2) to fix
          userInputParams.forEach((userInput) => {
            userInputOptions[userInput.name] = userInput.defaultValue;
          });
          fusionFilterOptionsInput[filter.name] = userInputOptions;
          const filterOptions: FusionFilterOptions = {
            input: fusionFilterOptionsInput,
          };
          filterOptionsList.push(filterOptions);
        });

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
        subscribeFusionAlerts,
        unsubscribeAlert,
        isAlertSubscribed,
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

// TODO: REMOVE after MVP-4329 merged
// Only support fusion event type
export const validateTopic = (
  topic: EventTypeItem,
): topic is FusionEventTypeItem => {
  return topic.type === 'fusion';
};

export type FusionEventMetadata = {
  uiConfigOverride?: {
    topicDisplayName?: string;
    historyDisplayName?: string;
  };
  filters: Array<AlertFilter>;
  requiredParserVariables: Array<RequiredParserVariable>;
};

/**
 * @param name - `string` unique name
 */
export type AlertFilter = {
  name: string;
  type: AlertFilterType;
  executionPriority: number;
  minimumDurationBetweenTriggersInMinutes: number;
  userInputParams: UserInputParam<UiType>[];
  staticFilterParams?: Record<string, object | string | number>;
};

export type RequiredParserVariable = {
  variableName: string;
  variableType: ValueType;
  variableDescription: string;
};

export type ValueType = 'integer' | 'price' | 'percentage';

/**
 * @param UiType - `radio` or `button` (scalable). Define what component should be rendered in Card topic subscription view.
 * @param defaultValue - The value for default alert subscription
 */
export type UserInputParam<T extends UiType> = {
  name: string;
  kind: T;
  valueTypes?: ValueType;
  options: (string | number)[];
  defaultValue: string | number;
  allowCustomInput?: boolean;
};

export type UiType = 'radio' | 'button';
type AlertFilterType = 'alertFilter';

export type FusionFilterOptions = {
  input: Record<AlertFilter['name'], UserInputOptions>;
};

export type UserInputOptions = Record<
  UserInputParam<UiType>['name'],
  UserInputParam<UiType>['options'][number]
>;
