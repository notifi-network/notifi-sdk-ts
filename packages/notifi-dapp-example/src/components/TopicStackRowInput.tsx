import { useTopicStackRowInput } from '@/hooks/useTopicStackRowInput';
import {
  FusionEventTopic,
  TopicMetadata,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import {
  convertOptionValue,
  getFusionEventMetadata,
  getFusionFilter,
  getUpdatedAlertFilterOptions,
  getUserInputParams,
  isAlertFilter,
  isTopicGroupValid,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { LoadingAnimation } from './LoadingAnimation';
import { SubscriptionValueInput } from './SubscriptionValueInput';
import { TopicRowCategory } from './TopicList';
import { TopicOptions } from './TopicOptions';

export type TopicStackRowInputPropsBase = {
  classNames?: {
    container?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
  };
  onSave?: () => void;
  copy?: {
    buttonContent?: string;
  };
};
type TopicStackGroupRowInputProps = TopicStackRowInputPropsBase & {
  topics: (FusionEventTopic | TopicMetadata)[];
};

type TopicStackStandaloneRowInputProps = TopicStackRowInputPropsBase & {
  topic: FusionEventTopic | TopicMetadata;
};

export type TopicStackRowInputProps<T extends TopicRowCategory> =
  T extends 'standalone'
    ? TopicStackStandaloneRowInputProps
    : TopicStackGroupRowInputProps;

export const TopicStackRowInput = <T extends TopicRowCategory>(
  props: TopicStackRowInputProps<T>,
) => {
  const isTopicGroup = isTopicStackRowInput(props);
  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;
  /* NOTE: benchmarkTopic is either the 'first topic in the group' or the 'standalone topic'. This represent the target topic to be rendered. */
  const fusionEventTypeId = benchmarkTopic.fusionEventDescriptor.id;
  if (!fusionEventTypeId) return null;
  if (isTopicGroup && !isTopicGroupValid(props.topics)) return null;
  const subscriptionValueOrRef =
    getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride
      ?.subscriptionValueOrRef;

  const description =
    getFusionFilter(isTopicGroup ? props.topics[0] : props.topic)
      ?.description ?? '';
  if (!subscriptionValueOrRef) {
    console.error(
      'ERROR - unable to render TopicStackRowInput. Ensure fusionEventMetadata includes subscriptionValueOrRef',
    );
    return null;
  }
  const { isLoading: isLoadingTopic } = useNotifiTopicContext();

  const filterName =
    getFusionEventMetadata(benchmarkTopic)?.filters.find(isAlertFilter)?.name;

  const userInputParams = getUserInputParams(benchmarkTopic);

  const {
    subscriptionValue,
    setSubscriptionValue,
    filterOptionsToBeSubscribed,
    setFilterOptionsToBeSubscribed,
    subscribeTopic,
    isTopicReadyToSubscribe,
  } = useTopicStackRowInput(
    isTopicGroup ? props.topics : [benchmarkTopic],
    userInputParams,
    filterName,
    props.onSave,
  );
  // TODO: refactor
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
              onClick={subscribeTopic}
            >
              {isLoadingTopic ? <LoadingAnimation /> : 'Save'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Utils

const isTopicStackRowInput = (
  props: TopicStackRowInputProps<TopicRowCategory>,
): props is TopicStackGroupRowInputProps => {
  return 'topics' in props;
};
