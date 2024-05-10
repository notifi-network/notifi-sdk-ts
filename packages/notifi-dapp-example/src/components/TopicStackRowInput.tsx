import {
  composeTopicStackAlertName,
  getFusionEventMetadata,
  getFusionFilter,
  getUpdatedAlertFilterOptions,
  getUserInputParams,
  isAlertFilter,
} from '@/utils/topic';
import {
  FusionEventTopic,
  FusionFilterOptions,
  InputObject,
} from '@notifi-network/notifi-frontend-client';
import {
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { LoadingAnimation } from './LoadingAnimation';
import { SubscriptionValueInput } from './SubscriptionValueInput';
import { TopicOptions } from './TopicOptions';

export type TopicStackRowInputProps = {
  topic: FusionEventTopic;
  onSave?: () => void;
  setIsTopicStackRowInputVisible: (visible: boolean) => void;
  copy?: {
    buttonContent?: string;
  };
};

export const TopicStackRowInput: React.FC<TopicStackRowInputProps> = (
  props,
) => {
  const subscriptionValueOrRef = getFusionEventMetadata(props.topic)
    ?.uiConfigOverride?.subscriptionValueOrRef;

  if (!subscriptionValueOrRef) {
    return null; // TODO: handle undefined or error
  }

  const [subscriptionValue, setSubscriptionValue] =
    React.useState<InputObject | null>(null);
  const [filterOptionsToBeSubscribed, setFilterOptionsToBeSubscribed] =
    React.useState<FusionFilterOptions | null>(null);

  // TODO: Move to hooks
  // TODO: use useMemo when it (filters array) possibly grows huge
  const filterName = getFusionEventMetadata(props.topic)?.filters.find(
    isAlertFilter,
  )?.name;

  const description = getFusionFilter(props.topic)?.description ?? '';

  const userInputParams = getUserInputParams(props.topic);
  const reversedParams = [...userInputParams].reverse();

  React.useEffect(() => {
    // Initial set up for filterOptionsToBeSubscribed
    if (userInputParams && filterName) {
      const input: FusionFilterOptions['input'] = {
        [filterName]: {},
      };
      userInputParams.forEach((userInputParam) => {
        input[filterName][userInputParam.name] = '';
      });
      setFilterOptionsToBeSubscribed({
        version: 1,
        input,
      });
    }
  }, []);

  // TODO: Move to hooks
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

  const {
    subscribeAlertsWithFilterOptions,
    isLoading: isLoadingTopic,
    error: topicError,
  } = useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const onSave = async () => {
    if (
      !filterOptionsToBeSubscribed ||
      !subscriptionValue ||
      !targetGroupId ||
      !isUserInputParamsValid
    )
      return;
    const alertName = composeTopicStackAlertName(
      props.topic.uiConfig.name,
      subscriptionValue.value,
      subscriptionValue.label,
    );

    await subscribeAlertsWithFilterOptions(
      [
        {
          topic: props.topic,
          filterOptions: filterOptionsToBeSubscribed,
          customAlertName: alertName,
          subscriptionValue: subscriptionValue.value,
        },
      ],
      targetGroupId,
    );
    setSubscriptionValue(null);
    props.setIsTopicStackRowInputVisible(false);
    props.onSave && props.onSave();
  };

  if (topicError) {
    // return <ErrorGlobal />; // TODO: handle error
  }

  return (
    <div className="">
      <SubscriptionValueInput
        subscriptionValueRef={subscriptionValueOrRef}
        subscriptionValue={subscriptionValue}
        setSubscriptionValue={setSubscriptionValue}
      />
      {subscriptionValue || userInputParams.length > 0 ? (
        <div className="">
          {reversedParams.map((userInputParm, id) => {
            return (
              <TopicOptions<'standalone'>
                index={id}
                description={description}
                userInputParam={userInputParm}
                topic={props.topic}
                onSelectAction={{
                  actionType: 'updateFilterOptions',
                  action: (userInputParmName, option) => {
                    if (!filterOptionsToBeSubscribed || !filterName) return;
                    const updatedAlertFilterOptiopns =
                      getUpdatedAlertFilterOptions(
                        filterName,
                        filterOptionsToBeSubscribed,
                        userInputParmName,
                        option,
                      );
                    setFilterOptionsToBeSubscribed(updatedAlertFilterOptiopns);
                  },
                }}
              />
            );
          })}
          <div
            className={`${
              !filterOptionsToBeSubscribed ||
              !subscriptionValue ||
              !targetGroupId ||
              !isUserInputParamsValid
                ? 'disabled'
                : ''
            }`}
          >
            {isLoadingTopic ? (
              <LoadingAnimation type={'spinner'} />
            ) : (
              <button
                className="ml-14 h-9 w-18 rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text mt-1 mb-4"
                onClick={onSave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
