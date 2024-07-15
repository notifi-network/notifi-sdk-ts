import { useGlobalStateContext } from '@/context/GlobalStateContext';
import {
  FusionEventTopic,
  FusionFilterOptions,
  InputObject,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import {
  TopicStackAlert,
  composeTopicStackAlertName,
  convertOptionValue,
  getFusionEventMetadata,
  getFusionFilter,
  getUpdatedAlertFilterOptions,
  getUserInputParams,
  isAlertFilter,
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
  topicStackAlerts: TopicStackAlert[];
  isTopicStackRowInputVisible: boolean;
};

export const TopicStackRowInput: React.FC<TopicStackRowInputProps> = (
  props,
) => {
  const { setGlobalError } = useGlobalStateContext();
  const subscriptionValueOrRef = getFusionEventMetadata(props.topic)
    ?.uiConfigOverride?.subscriptionValueOrRef;

  if (!subscriptionValueOrRef) {
    return null; // TODO: handle undefined or error
  }

  const [subscriptionValue, setSubscriptionValue] =
    React.useState<InputObject | null>(null);
  const [filterOptionsToBeSubscribed, setFilterOptionsToBeSubscribed] =
    React.useState<FusionFilterOptions | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // TODO: Move to hooks
  // TODO: use useMemo when it (filters array) possibly grows huge
  const filterName = getFusionEventMetadata(props.topic)?.filters.find(
    isAlertFilter,
  )?.name;

  const description = getFusionFilter(props.topic)?.description ?? '';

  const userInputParams = getUserInputParams(props.topic);

  const correctUserInputParamsOrder = (
    userInputParams: UserInputParam<UiType>[],
  ) => {
    if (userInputParams.length > 0 && userInputParams[0].uiType === 'radio') {
      return userInputParams;
    } else {
      const reversedParams = [...userInputParams].reverse();
      return reversedParams;
    }
  };

  React.useEffect(() => {
    // Initial set up for filterOptionsToBeSubscribed
    if (userInputParams && filterName) {
      const input: FusionFilterOptions['input'] = {
        [filterName]: {},
      };
      userInputParams.forEach((userInputParam) => {
        if (userInputParam.uiType === 'radio') {
          input[filterName][userInputParam.name] = userInputParam.defaultValue;
        } else {
          input[filterName][userInputParam.name] = '';
        }
      });
      setFilterOptionsToBeSubscribed({
        version: 1,
        input,
      });
    }
    if (subscriptionValue) {
      props.setIsTopicStackRowInputVisible(true);
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

  const { subscribeAlertsWithFilterOptions, error: topicError } =
    useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const isTopicReadyToSubscribe = !!(
    filterOptionsToBeSubscribed &&
    subscriptionValue &&
    targetGroupId &&
    isUserInputParamsValid
  );

  const onSave = async () => {
    if (!isTopicReadyToSubscribe || !props.topic.fusionEventDescriptor.id)
      return;
    const alertName = composeTopicStackAlertName(
      props.topic.fusionEventDescriptor.id,
      subscriptionValue.value,
      subscriptionValue.label,
    );
    setIsLoading(true);
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
    if (userInputParams && filterName) {
      const input: FusionFilterOptions['input'] = {
        [filterName]: {},
      };
      userInputParams.forEach((userInputParam) => {
        if (userInputParam.uiType === 'radio') {
          input[filterName][userInputParam.name] = userInputParam.defaultValue;
        } else {
          input[filterName][userInputParam.name] = '';
        }
      });
      setFilterOptionsToBeSubscribed({
        version: 1,
        input,
      });
    }
    setSubscriptionValue(null);
    props.setIsTopicStackRowInputVisible(false);
    props.onSave && props.onSave();
    setIsLoading(false);
  };

  if (topicError) {
    setGlobalError(topicError.message);
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
          {correctUserInputParamsOrder(userInputParams).map(
            (userInputParm, id) => {
              return (
                <TopicOptions<'standalone'>
                  placeholder="Enter Price"
                  index={id}
                  key={id}
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
                          convertOptionValue(option, userInputParm.kind),
                        );
                      setFilterOptionsToBeSubscribed(
                        updatedAlertFilterOptiopns,
                      );
                    },
                  }}
                />
              );
            },
          )}
          <div>
            <button
              disabled={!isTopicReadyToSubscribe}
              className="ml-14 h-9 w-18 rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text mt-1 mb-4 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg "
              onClick={onSave}
            >
              {isLoading ? <LoadingAnimation /> : 'Save'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
