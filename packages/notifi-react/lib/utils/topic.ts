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
  LabelUiConfig,
  TopicMetadata,
  TopicUiConfig,
  UiType,
  UserInputParam,
  ValueType,
  objectKeys,
} from '@notifi-network/notifi-frontend-client';

export type LabelWithSubTopicsEventTypeItem = (
  | LabelUiConfig
  | LabelEventTypeItem
) & {
  subTopics: Array<FusionToggleEventTypeItem | TopicUiConfig>;
};

type ValidTypeItem =
  | FusionToggleEventTypeItem
  | LabelEventTypeItem
  | TopicUiConfig
  | LabelUiConfig;

const validateEventType = (
  eventType: EventTypeItem | LabelEventTypeItem | TopicUiConfig | LabelUiConfig,
): eventType is ValidTypeItem => {
  return eventType.type === 'fusion' || eventType.type === 'label';
};

export const categorizeTopics = (
  topics: ReadonlyArray<
    EventTypeItem | LabelEventTypeItem | TopicUiConfig | LabelUiConfig
  >,
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
  topic: FusionEventTopic | TopicMetadata,
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

export const getUiConfigOverride = (
  topic: FusionEventTopic | TopicMetadata,
): FusionEventMetadata['uiConfigOverride'] => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (!isFusionEventMetadata(parsedMetadata)) {
    return {};
  }
  return parsedMetadata?.uiConfigOverride ?? {};
};

export const getFusionEventMetadata = (
  topic: FusionEventTopic | TopicMetadata,
): FusionEventMetadata | null => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (isFusionEventMetadata(parsedMetadata)) {
    return parsedMetadata;
  }
  return null;
};

export const getFusionFilter = (
  topic: FusionEventTopic | TopicMetadata,
): AlertFilter | null => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  );
  if (isFusionEventMetadata(parsedMetadata)) {
    return (parsedMetadata?.filters as AlertFilter[])?.[0] ?? {};
  }
  return null;
};

export const isTopicGroupValid = (
  topics: (FusionEventTopic | TopicMetadata)[],
): boolean => {
  // NOTE: Ensure all topics have no filters at the same time
  const isAllTopicWithoutFilters = topics.every(
    (topic) =>
      getFusionEventMetadata(topic)?.filters.filter(isAlertFilter).length === 0,
  );
  console.log(3);
  if (isAllTopicWithoutFilters) {
    return true;
  }
  console.log(4);

  // NOTE: Ensure all topics have the same userInputParams' options & default value
  const benchmarkTopic = topics[0];
  const benchmarkTopicMetadata = getFusionEventMetadata(benchmarkTopic);

  const benchmarkTopicFilters = benchmarkTopicMetadata?.filters;

  // CASE#1: CM topic (filters always empty array) or Non-CM topic with no filters
  if (!benchmarkTopicFilters || benchmarkTopicFilters.length === 0) {
    return true;
  }

  // CASE#2: Non-CM topic with only FrequencyFilter
  if (
    benchmarkTopicFilters.length === 1 &&
    benchmarkTopicFilters[0].type === 'FrequencyAlertFilter'
  ) {
    return true;
  }

  // CASE#3: Non-CM topic with AlertFilter
  const benchmarkAlertFilter = benchmarkTopicFilters.find(isAlertFilter);
  const benchmarkUserInputParams = benchmarkAlertFilter?.userInputParams;
  console.log(5, benchmarkTopicMetadata);
  if (!benchmarkAlertFilter) {
    return false;
  }
  console.log(6);

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
      const benchmarkUserInputParamKeys = Array.from(
        benchmarkUserInputParamMap.keys(),
      );
      for (const key of benchmarkUserInputParamKeys) {
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

  // NOTE: If It is stackable topic, ensure all topics have the same subscriptionRef
  const benchmarkSubscriptionValueOrRef =
    benchmarkTopicMetadata?.uiConfigOverride?.subscriptionValueOrRef;
  const benchmarkSubscriptionRef =
    benchmarkSubscriptionValueOrRef?.type === 'ref'
      ? benchmarkSubscriptionValueOrRef.ref
      : null;
  if (
    benchmarkTopicMetadata?.uiConfigOverride?.isSubscriptionValueInputable &&
    benchmarkSubscriptionRef
  ) {
    const isValid = topics.every((topic) => {
      const subTopicMetadata = getFusionEventMetadata(topic);
      const subTopicSubscriptionValueOrRef =
        subTopicMetadata?.uiConfigOverride?.subscriptionValueOrRef;
      const subTopicSubscriptionRef =
        subTopicSubscriptionValueOrRef?.type === 'ref'
          ? subTopicSubscriptionValueOrRef.ref
          : null;
      return benchmarkSubscriptionRef === subTopicSubscriptionRef;
    });
    return isValid;
  }

  return true;
};

export const isFusionEventMetadata = (
  metadata: unknown,
): metadata is FusionEventMetadata => {
  if (typeof metadata !== 'object' || !metadata) {
    return false;
  }
  return 'filters' in metadata && Array.isArray(metadata.filters);
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
  if (typeof filterOptions !== 'object' || !filterOptions) {
    return false;
  }
  return 'version' in filterOptions && filterOptions.version === 1;
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
    'subscriptionLabel' in alertMetadata &&
    'fusionEventTypeId' in alertMetadata
  );
};

export type AlertMetadata = AlertMetadataBase | AlertMetadataForTopicStack;

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
  filterOptions: FusionFilterOptions;
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

/** @deprecated no longer need this, use "value" directly. Reason: to simplify and show the values without any conversion. If the developer needs to convert the 50% to .5, then they can normalize their values by converting from .5 to 50. We give flexibility to the developers to pass any values from parsers  */
export const convertOptionValue = (
  value: string | number,
  type: ValueType,
  direction?: ConvertOptionDirection,
) => {
  if (value === '') return '';
  direction = direction ?? ConvertOptionDirection.FtoB;
  if (type === 'percentage') {
    return direction === ConvertOptionDirection.FtoB
      ? Number(value) / 100
      : Number(value) * 100;
  }
  return value;
};
