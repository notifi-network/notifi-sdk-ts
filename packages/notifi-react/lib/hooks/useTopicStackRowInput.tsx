import {
  FusionEventTopic,
  FusionFilterOptions,
  InputObject,
  TopicMetadata,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import {
  TopicWithFilterOption,
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '../context';
import {
  AlertMetadata,
  AlertMetadataForTopicStack,
  composeTopicStackAlertName,
  convertOptionValue,
  isEqual,
  resolveAlertName,
} from '../utils';

export const useTopicStackRowInput = (
  topics: (FusionEventTopic | TopicMetadata)[],
  userInputParams: UserInputParam<UiType>[],
  filterName?: string,
  onSave?: () => void,
) => {
  const benchmarkTopic = topics[0];
  const [subscriptionValue, setSubscriptionValue] =
    React.useState<InputObject | null>(null);
  const [filterOptionsToBeSubscribed, setFilterOptionsToBeSubscribed] =
    React.useState<FusionFilterOptions | null>(null);
  const { subscribeAlertsWithFilterOptions, getTopicStackAlerts } =
    useNotifiTopicContext();
  React.useEffect(() => {
    // Initial set up for filterOptionsToBeSubscribed
    if (userInputParams && filterName) {
      const input: FusionFilterOptions['input'] = {
        [filterName]: {},
      };
      userInputParams.forEach((userInputParam) => {
        input[filterName][userInputParam.name] = convertOptionValue(
          userInputParam.defaultValue,
          userInputParam.kind,
        );
      });
      setFilterOptionsToBeSubscribed({
        version: 1,
        input,
      });
    }
  }, []);

  const isUserInputParamsValid = React.useMemo(() => {
    if (filterOptionsToBeSubscribed && filterName) {
      filterOptionsToBeSubscribed.input[filterName];
      const isAllFieldsInputted = userInputParams.every((userInputParam) => {
        const input = filterOptionsToBeSubscribed.input;
        return (
          !!input[filterName][userInputParam.name] &&
          input[filterName][userInputParam.name] !== ''
        );
      });
      return isAllFieldsInputted ? true : false;
    }
    return false;
  }, [filterOptionsToBeSubscribed]);

  const subscribedAlerts = getTopicStackAlerts(
    benchmarkTopic.fusionEventDescriptor.id ?? '',
  );

  const isInvalid = subscribedAlerts?.some((alert) => {
    // Not allow duplicate subscriptionValue with the same filterOptions
    const alertMetadata = resolveAlertName(alert.alertName);
    if (!isStackTopicAlertMetadata(alertMetadata)) return false;
    const isSubscriptionValueMatched =
      alertMetadata.subscriptionValue === subscriptionValue?.value;
    const isFilterOptionMatched = isEqual(
      alert.filterOptions,
      filterOptionsToBeSubscribed,
    );
    return isFilterOptionMatched && isSubscriptionValueMatched;
  });

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const isTopicReadyToSubscribe = !!(
    filterOptionsToBeSubscribed &&
    subscriptionValue &&
    targetGroupId &&
    isUserInputParamsValid &&
    !isInvalid
  );

  const subscribeTopic = async () => {
    if (!isTopicReadyToSubscribe || !benchmarkTopic.fusionEventDescriptor.id)
      return;

    const topicWithFilterOptionsList = topics
      .map((topic) => {
        return !topic.fusionEventDescriptor.id
          ? null
          : ({
              topic: topic,
              filterOptions: filterOptionsToBeSubscribed,
              customAlertName: composeTopicStackAlertName(
                topic.fusionEventDescriptor.id,
                subscriptionValue.value,
                subscriptionValue.label,
              ),
              subscriptionValue: subscriptionValue.value,
            } as TopicWithFilterOption);
      })
      .filter(
        (
          topicWithFilterOptions,
        ): topicWithFilterOptions is TopicWithFilterOption =>
          topicWithFilterOptions !== null,
      );

    await subscribeAlertsWithFilterOptions(
      topicWithFilterOptionsList,
      targetGroupId,
    );
    setSubscriptionValue(null);
    onSave && onSave();
  };

  return {
    subscriptionValue,
    setSubscriptionValue,
    filterOptionsToBeSubscribed,
    setFilterOptionsToBeSubscribed,
    isUserInputParamsValid,
    subscribeTopic,
    isTopicReadyToSubscribe,
  };
};
const isStackTopicAlertMetadata = (
  metadata: AlertMetadata,
): metadata is AlertMetadataForTopicStack => {
  return 'subscriptionValue' in metadata && 'subscriptionLabel' in metadata;
};
