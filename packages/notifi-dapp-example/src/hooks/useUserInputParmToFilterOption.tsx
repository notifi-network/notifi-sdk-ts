import {
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import {
  derivePrefixAndSuffixFromValueType,
  getUpdatedAlertFilterOptions,
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

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

  const subscribedValue = userInputOptions?.[userInputParam.name];

  const [customInput, setCustomInput] = React.useState<string | number>('');
  React.useEffect(() => {
    if (
      !!subscribedValue &&
      !userInputParam.options.includes(subscribedValue)
    ) {
      setCustomInput(subscribedValue);
      return;
    }
    setCustomInput('');
  }, [subscribedValue]);

  const uiType = userInputParam.uiType;

  const prefixAndSuffix = derivePrefixAndSuffixFromValueType(
    userInputParam.kind,
  );

  const renewFilterOptions = async (
    option: number | string,
    topics: FusionEventTopic[],
  ) => {
    if (!alertFilterOptions || !targetGroupId) return;
    const updatedAlertFilterOptiopns = getUpdatedAlertFilterOptions(
      filterName,
      alertFilterOptions,
      userInputParam.name,
      option,
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
    subscribedValue,
    uiType,
    setCustomInput,
  };
};
