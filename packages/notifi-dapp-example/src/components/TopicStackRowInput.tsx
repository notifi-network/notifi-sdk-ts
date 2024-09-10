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
  TopicWithFilterOption,
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
import { TopicRowCategory } from './TopicList';
import { TopicOptions } from './TopicOptions';

type TopicGroupStackRowInputProps = {
  topics: FusionEventTopic[];
  onSave?: () => void;
  setIsTopicStackRowInputVisible: (visible: boolean) => void;
  isTopicStackRowInputVisible: boolean;
};
type TopicStandAloneStackRowInputProps = {
  topic: FusionEventTopic;
  onSave?: () => void;
  setIsTopicStackRowInputVisible: (visible: boolean) => void;
  isTopicStackRowInputVisible: boolean;
};

export type TopicStackRowInputProps<T extends TopicRowCategory> =
  T extends 'standalone'
    ? TopicStandAloneStackRowInputProps
    : TopicGroupStackRowInputProps;

export const TopicStackRowInput = <T extends TopicRowCategory>(
  props: TopicStackRowInputProps<T>,
) => {
  const isTopicGroup = isTopicGroupStackRowInput(props);
  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;
  const { setGlobalError } = useGlobalStateContext();
  const subscriptionValueOrRef = getFusionEventMetadata(
    isTopicGroup ? props.topics[0] : props.topic,
  )?.uiConfigOverride?.subscriptionValueOrRef;

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
  const filterName = getFusionEventMetadata(
    isTopicGroup ? props.topics[0] : props.topic,
  )?.filters.find(isAlertFilter)?.name;

  const description =
    getFusionFilter(isTopicGroup ? props.topics[0] : props.topic)
      ?.description ?? '';

  const userInputParams = getUserInputParams(
    isTopicGroup ? props.topics[0] : props.topic,
  );

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
    if (!isTopicReadyToSubscribe || !benchmarkTopic.fusionEventDescriptor.id)
      return;

    const subscribeTopics = isTopicGroup ? props.topics : [props.topic];
    const topicWithFilterOptionsList = subscribeTopics
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
          {isTopicGroup
            ? correctUserInputParamsOrder(userInputParams).map(
                (userInputParm, id) => {
                  return (
                    <TopicOptions<'group'>
                      index={id}
                      key={id}
                      description={description}
                      userInputParam={userInputParm}
                      topics={props.topics}
                      onSelectAction={{
                        actionType: 'updateFilterOptions',
                        action: (userInputParmName, option) => {
                          if (!filterOptionsToBeSubscribed || !filterName)
                            return;
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
              )
            : correctUserInputParamsOrder(userInputParams).map(
                (userInputParm, id) => {
                  return (
                    <TopicOptions<'standalone'>
                      index={id}
                      key={id}
                      description={description}
                      userInputParam={userInputParm}
                      topic={props.topic}
                      onSelectAction={{
                        actionType: 'updateFilterOptions',
                        action: (userInputParmName, option) => {
                          if (!filterOptionsToBeSubscribed || !filterName)
                            return;
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

const isTopicGroupStackRowInput = (
  props: TopicStackRowInputProps<TopicRowCategory>,
): props is TopicGroupStackRowInputProps => {
  return 'topics' in props;
};
