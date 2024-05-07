import {
  AlertFilter,
  EventTypeItem,
  FusionEventMetadata,
  FusionEventTopic,
  FusionFilterOptions,
  FusionToggleEventTypeItem,
  LabelEventTypeItem,
  UiType,
  UserInputParam,
  ValueType,
} from '@notifi-network/notifi-frontend-client';
import { Filter } from 'notifi-frontend-client/dist';

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
  // NOTE: Ensure all topics have the same userInputParams' options & default value
  const benchmarkTopic = topics[0];
  const benchmarkTopicMetadata = JSON.parse(
    benchmarkTopic.fusionEventDescriptor.metadata ?? '{}',
  ) as FusionEventMetadata;
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
  }
};
