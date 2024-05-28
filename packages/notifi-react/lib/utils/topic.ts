import {
  AlertFilter,
  EventTypeItem,
  Filter,
  FusionEventMetadata,
  FusionEventTopic,
  FusionFilterOptions,
  FusionToggleEventTypeItem,
  InputObject,
  LabelEventTypeItem,
  UiType,
  UserInputParam,
  ValueType,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';

export type LabelWithSubTopicsEventTypeItem = LabelEventTypeItem & {
  subTopics: Array<FusionToggleEventTypeItem>;
};

type ValidTypeItem = FusionToggleEventTypeItem | LabelEventTypeItem;

const validateEventType = (
  eventType: EventTypeItem,
): eventType is ValidTypeItem => {
  // NOTE: now only support toggle fusion event type.
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

export const getUserInputParams = (
  topic: FusionEventTopic,
): UserInputParam<UiType>[] => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (!isFusionEventMetadata(parsedMetadata)) {
    return [];
  }
  const filters = parsedMetadata?.filters?.filter(isAlertFilter) ?? [];
  return filters[0]?.userInputParams ?? [];
};

export const getFusionEventMetadata = (
  topic: FusionEventTopic,
): FusionEventMetadata | null => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (isFusionEventMetadata(parsedMetadata)) {
    return parsedMetadata;
  }
  return null;
};

export const isTopicGroupValid = (topics: FusionEventTopic[]): boolean => {
  // NOTE: Ensure all topics have no filters at the same time
  const isAllTopicWithoutFilters = topics.every(
    (topic) =>
      getFusionEventMetadata(topic)?.filters.filter(isAlertFilter).length === 0,
  );
  if (isAllTopicWithoutFilters) {
    return true;
  }

  // NOTE: Ensure all topics have the same userInputParams' options & default value
  const benchmarkTopic = topics[0];
  const benchmarkTopicMetadata = getFusionEventMetadata(benchmarkTopic);
  const benchmarkAlertFilter =
    benchmarkTopicMetadata?.filters.find(isAlertFilter);
  const benchmarkUserInputParams = benchmarkAlertFilter?.userInputParams;

  if (!benchmarkAlertFilter) {
    return false;
  }

  if (benchmarkUserInputParams && benchmarkUserInputParams.length > 0) {
    const isGroupNameNotMatched = topics.find(
      (topic) =>
        topic.uiConfig.topicGroupName !==
        benchmarkTopic.uiConfig.topicGroupName,
    );
    if (isGroupNameNotMatched) {
      return false;
    }

    const userInputParamsList = topics.map((topic) => {
      return getUserInputParams(topic);
    });

    for (let i = 1; i < userInputParamsList.length; i++) {
      const userInputParams = userInputParamsList[i];
      const userInputParamMap = new Map<string, UserInputParam<UiType>>(
        userInputParams.map((userInputParam) => [
          userInputParam.name,
          userInputParam,
        ]),
      );

      const benchmarkUserInputParamMap = new Map<
        string,
        UserInputParam<UiType>
      >(
        benchmarkUserInputParams.map((userInputParam) => [
          userInputParam.name,
          userInputParam,
        ]),
      );
      // TODO: Fix O(n^2) complexity
      for (const key of benchmarkUserInputParamMap.keys()) {
        const benchmarkUserInputParam = benchmarkUserInputParamMap.get(key);
        const userInputParam = userInputParamMap.get(key);
        if (!userInputParam || !benchmarkUserInputParam) {
          return false;
        }

        const benchmarkParamOptions = benchmarkUserInputParam.options.join('');
        const userInputParamOptions = userInputParam.options.join('');
        if (benchmarkParamOptions !== userInputParamOptions) {
          return false;
        }

        if (
          benchmarkUserInputParam.defaultValue !== userInputParam.defaultValue
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const isFusionEventMetadata = (
  metadata: unknown,
): metadata is FusionEventMetadata => {
  const metadataToVerify = metadata as any;
  if (typeof metadataToVerify !== 'object' || !metadataToVerify) {
    return false;
  }
  return (
    'filters' in metadataToVerify && Array.isArray(metadataToVerify.filters)
  );
};

export const isAlertFilter = (filter: Filter): filter is AlertFilter => {
  return (
    'userInputParams' in filter &&
    'type' in filter &&
    filter.type === 'AlertFilter'
  );
};

export const isFusionFilterOptions = (
  filterOptions: unknown,
): filterOptions is FusionFilterOptions => {
  const filterOptionsToVerify = filterOptions as any;
  if (typeof filterOptionsToVerify !== 'object' || !filterOptionsToVerify) {
    return false;
  }
  return (
    'version' in filterOptionsToVerify && filterOptionsToVerify.version === 1
  );
};

export const getUpdatedAlertFilterOptions = (
  filterName: string,
  alertFilterOptions: FusionFilterOptions,
  inputParmName: string,
  value: string | number,
) => {
  return {
    ...alertFilterOptions,
    input: {
      ...alertFilterOptions.input,
      [filterName]: {
        ...alertFilterOptions.input[filterName],
        [inputParmName]: value,
      },
    },
  };
};

/** @deprecated use `userInputParam.prefixAndSuffix` */
export const derivePrefixAndSuffixFromValueType = (
  kind: ValueType,
): { prefix: string; suffix: string } => {
  switch (kind) {
    case 'price':
      return {
        prefix: '$',
        suffix: '',
      };
    case 'percentage':
      return {
        prefix: '',
        suffix: '%',
      };
    case 'string':
    case 'integer':
      return {
        prefix: '',
        suffix: '',
      };
    default:
      return {
        prefix: '',
        suffix: '',
      };
  }
};

export type AlertMetadataBase = {
  fusionEventTypeId: string;
};

export type AlertMetadataForTopicStack = AlertMetadataBase & {
  subscriptionValue: string;
  subscriptionLabel: string;
  timestamp: string;
};

export const isAlertMetadataForTopicStack = (
  alertMetadata: AlertMetadata,
): alertMetadata is AlertMetadataForTopicStack => {
  return (
    objectKeys(alertMetadata).length > 1 &&
    'timestamp' in alertMetadata &&
    'subscriptionValue' in alertMetadata &&
    'subscriptionLabel' in alertMetadata
  );
};

type AlertMetadata = AlertMetadataBase | AlertMetadataForTopicStack;

export const resolveAlertName = (alertName: string): AlertMetadata => {
  /** alertName always start with its corresponding `fusionEventTypeId`:
   * 1. Alert created from normal topic (standalone topic or topic group): alert.name = fusionEventTypeId
   * 2. Alert created from topic stack: alert.name = fusionEventTypeId:;:subscriptionValue:;:subscriptionLabel
   * ... if more to come, add the identifier after fusionEventTypeId ex. fusionEventTypeId:;:<identifier>:;:<metadata>
   */
  const resolved = alertName.split(':;:');
  if (resolved.length === 1) {
    return {
      fusionEventTypeId: resolved[0],
    };
  }
  const [fusionEventTypeId, subscriptionValue, subscriptionLabel, timestamp] =
    resolved;
  return {
    fusionEventTypeId,
    subscriptionValue,
    subscriptionLabel,
    timestamp,
  };
};

/** TopicStackRow related */

export type TopicStackAlert = {
  alertName: string;
  id: string;
  subscriptionValueInfo: InputObject;
};

/** @deprecated - Use resolveAlertName instead */
export const resolveTopicStackAlertName = (alertName: string) => {
  const [fusionEventTypeId, subscriptionValue, subscriptionLabel, timestamp] =
    alertName.split(':;:');
  return {
    fusionEventTypeId,
    subscriptionValue,
    subscriptionLabel,
    timestamp,
  };
};

export const composeTopicStackAlertName = (
  fusionEventTypeId: string,
  subscriptionValue: string,
  subscriptionLabel: string,
) => {
  return `${fusionEventTypeId}:;:${subscriptionValue}:;:${subscriptionLabel}:;:${Date.now()}`;
};

export enum ConvertOptionDirection {
  /**Note: Convert the value rendered in browser to notifi backend acceptable format */
  FtoB = 'frontendToBackend',
  /**Note: Convert the value received from notifi backend to frontend renderable format */
  BtoF = 'BackendToFrontend',
}

export const convertOptionValue = (
  value: string | number,
  type: ValueType,
  direction?: ConvertOptionDirection,
) => {
  if (!value) return '';
  direction = direction ?? ConvertOptionDirection.FtoB;
  if (type === 'percentage') {
    return direction === ConvertOptionDirection.FtoB
      ? Number(value) / 100
      : Number(value) * 100;
  }
  return value;
};
