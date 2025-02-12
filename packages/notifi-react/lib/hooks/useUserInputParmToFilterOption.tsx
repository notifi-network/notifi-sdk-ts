import {
  FusionEventTopic,
  TopicMetadata,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import {
  ConvertOptionDirection,
  convertOptionValue,
  derivePrefixAndSuffixFromValueType,
  getUpdatedAlertFilterOptions,
} from '../utils';

export const useUserInputParmToFilterOption = (
  alertName: string,
  userInputParam: UserInputParam<UiType>,
) => {
  const { getAlertFilterOptions, subscribeAlertsWithFilterOptions } =
    useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const alertFilterOptions = getAlertFilterOptions(alertName);

  const filterName: string | undefined = Object.keys(
    alertFilterOptions?.input ?? [],
  )[0]; // NOTE: Only consider 1 to 1 relationship (1 filter for 1 topic)
  const userInputOptions = alertFilterOptions?.input[filterName];

  const subscribedValue = convertOptionValue(
    userInputOptions?.[userInputParam.name] ?? '',
    userInputParam.kind,
    ConvertOptionDirection.BtoF,
  ).toString();

  const [customInput, setCustomInput] = React.useState<string | number>('');
  React.useEffect(() => {
    if (
      !!subscribedValue &&
      !userInputParam.options
        .map((option) => option.toString())
        .includes(subscribedValue.toString())
    ) {
      setCustomInput(subscribedValue);
      return;
    }
    setCustomInput('');
  }, [subscribedValue]);

  const uiType = userInputParam.uiType;

  const prefixAndSuffix =
    userInputParam.prefixAndSuffix ??
    derivePrefixAndSuffixFromValueType(userInputParam.kind);

  const renewFilterOptions = async (
    option: number | string,
    topics: (FusionEventTopic | TopicMetadata)[],
  ) => {
    if (!alertFilterOptions || !targetGroupId) return;
    const updatedAlertFilterOptiopns = getUpdatedAlertFilterOptions(
      filterName,
      alertFilterOptions,
      userInputParam.name,
      convertOptionValue(option, userInputParam.kind),
    );
    await subscribeAlertsWithFilterOptions(
      topics.map((topic) => {
        return {
          topic: topic,
          filterOptions: updatedAlertFilterOptiopns,
        };
      }),
      targetGroupId,
    );
  };
  return {
    customInput,
    prefixAndSuffix,
    renewFilterOptions,
    subscribedValue: subscribedValue.toString(),
    uiType,
    setCustomInput,
  };
};
