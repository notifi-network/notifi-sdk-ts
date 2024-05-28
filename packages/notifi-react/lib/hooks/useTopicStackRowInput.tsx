import {
  FusionEventTopic,
  FusionFilterOptions,
  InputObject,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { composeTopicStackAlertName, convertOptionValue } from '../utils';

export const useTopicStackRowInput = (
  topic: FusionEventTopic,
  userInputParams: UserInputParam<UiType>[],
  filterName?: string,
  onSave?: () => void,
) => {
  const [subscriptionValue, setSubscriptionValue] =
    React.useState<InputObject | null>(null);
  const [filterOptionsToBeSubscribed, setFilterOptionsToBeSubscribed] =
    React.useState<FusionFilterOptions | null>(null);

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

  const { subscribeAlertsWithFilterOptions } = useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const isTopicReadyToSubscribe = !!(
    filterOptionsToBeSubscribed &&
    subscriptionValue &&
    targetGroupId &&
    isUserInputParamsValid
  );

  const subscribeTopic = async () => {
    if (!isTopicReadyToSubscribe || !topic.fusionEventDescriptor.id) return;
    const alertName = composeTopicStackAlertName(
      topic.fusionEventDescriptor.id,
      subscriptionValue.value,
      subscriptionValue.label,
    );

    await subscribeAlertsWithFilterOptions(
      [
        {
          topic: topic,
          filterOptions: filterOptionsToBeSubscribed,
          customAlertName: alertName,
          subscriptionValue: subscriptionValue.value,
        },
      ],
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
