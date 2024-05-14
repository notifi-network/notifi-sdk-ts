import { Icon } from '@/assets/Icon';
import {
  ConvertOptionDirection,
  TopicStackAlert,
  convertOptionValue,
  derivePrefixAndSuffixFromValueType,
  getFusionEventMetadata,
  isAlertFilter,
} from '@/utils/topic';
import {
  FusionEventTopic,
  UserInputOptions,
  ValueType,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiTopicContext } from '@notifi-network/notifi-react';
import React from 'react';

type TopicStackProps = {
  topicStackAlert: TopicStackAlert;
  topic: FusionEventTopic;
};

export const TopicStack: React.FC<TopicStackProps> = (props) => {
  const { unsubscribeAlert, getAlertFilterOptions } = useNotifiTopicContext();
  const userInputOptions = React.useMemo(() => {
    const input = getAlertFilterOptions(props.topicStackAlert.alertName)?.input;
    if (!input) return;
    return Object.values(input)[0];
  }, [getAlertFilterOptions]);
  const { isLoading } = useNotifiTopicContext();

  const fusionEventMetadata = getFusionEventMetadata(props.topic);
  const alertFilter = fusionEventMetadata?.filters.find(isAlertFilter);

  if (!alertFilter) {
    return null;
  }

  const userInputParmValueTypeMap = new Map(
    alertFilter.userInputParams.map((param) => [param.name, param.kind]),
  );
  const userInputOptionValuesToBeDisplayed =
    userInputOptions &&
    isAboveOrBelowThresholdUserInputOptions(userInputOptions)
      ? sortAboveOrBelowThresholdUserInputOptionValue(
          userInputOptions,
          userInputParmValueTypeMap,
        )
      : [];
  return (
    <div className="flex flex-row justify-between items-center py-3 border-b border-notifi-card-border">
      <div className="flex flex-col items-start">
        <div className="text-sm font-regular text-notifi-text">
          {props.topicStackAlert.subscriptionValueInfo.label}
        </div>
        <div className="flex flex-row text-xs font-regular text-notifi-text-light">
          {userInputOptionValuesToBeDisplayed.map((option, id) => (
            <div key={id} className="mr-1 mt-1">
              {option}
            </div>
          ))}
        </div>
      </div>

      <div
        className=""
        onClick={() => unsubscribeAlert(props.topicStackAlert.alertName)}
      >
        <Icon
          id="trash-btn"
          className="text-notifi-text-light top-6 left-4 cursor-pointer"
        />
      </div>
    </div>
  );
};

// Utils

// TODO: refactor & consolidate this type with `UserInputOptions` from `@notifi-network/notifi-frontend-client`
type AboveOrBelowThresholdUserInputOptions = Record<
  'threshold' | 'thresholdDirection',
  string
>;

const isAboveOrBelowThresholdUserInputOptions = (
  userInputOptions: UserInputOptions,
): userInputOptions is AboveOrBelowThresholdUserInputOptions => {
  return !!userInputOptions.threshold && !!userInputOptions.thresholdDirection;
};

const sortAboveOrBelowThresholdUserInputOptionValue = (
  filterOptions: Record<'threshold' | 'thresholdDirection', string>,
  userInputParmValueTypeMap: Map<string, ValueType>,
) => {
  const sortedFilterOptions = [];
  if (filterOptions.thresholdDirection) {
    const thresholdDirection =
      filterOptions.thresholdDirection[0].toUpperCase() +
      filterOptions.thresholdDirection.slice(1);
    sortedFilterOptions.push(thresholdDirection);
  }
  if (filterOptions.threshold) {
    const valueType = userInputParmValueTypeMap.get('threshold');
    if (valueType) {
      const prefix = derivePrefixAndSuffixFromValueType(valueType);
      const suffix = derivePrefixAndSuffixFromValueType(valueType);
      const thresholdValue = convertOptionValue(
        filterOptions.threshold,
        valueType,
        ConvertOptionDirection.BtoF,
      );
      sortedFilterOptions.push(
        `${prefix.prefix} ${thresholdValue} ${suffix.suffix}`,
      );
    }
  }
  return sortedFilterOptions;
};
