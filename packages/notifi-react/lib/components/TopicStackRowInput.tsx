import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTopicContext } from '../context';
import { useTopicStackRowInput } from '../hooks/useTopicStackRowInput';
import {
  convertOptionValue,
  defaultCopy,
  getFusionEventMetadata,
  getUpdatedAlertFilterOptions,
  getUserInputParams,
  isAlertFilter,
  isTopicGroupValid,
} from '../utils';
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
  // topic: FusionEventTopic;
  onSave?: () => void;
  copy?: {
    buttonContent?: string;
  };
};

type TopicStackGroupRowInputProps = TopicStackRowInputPropsBase & {
  topics: FusionEventTopic[];
};

type TopicStackStandaloneRowInputProps = TopicStackRowInputPropsBase & {
  topic: FusionEventTopic;
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

  return (
    <div
      className={clsx(
        'notifi-topic-stack-row-input',
        props.classNames?.container,
      )}
    >
      <SubscriptionValueInput
        subscriptionValueRef={subscriptionValueOrRef}
        subscriptionValue={subscriptionValue}
        setSubscriptionValue={setSubscriptionValue}
      />
      <div className={clsx('notifi-topic-row-user-inputs-row-container')}>
        {userInputParams.map((userInputParm, id) => {
          return (
            <TopicOptions<'standalone'>
              key={id}
              userInputParam={userInputParm}
              topic={benchmarkTopic}
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
                  setFilterOptionsToBeSubscribed(updatedAlertFilterOptiopns);
                },
              }}
            />
          );
        })}
        <div
          className={clsx(
            'notifi-topic-stack-row-input-button',
            props.classNames?.button,
            !isTopicReadyToSubscribe && 'disabled',
          )}
          onClick={subscribeTopic}
        >
          {isLoadingTopic ? (
            <LoadingAnimation
              type={'spinner'}
              classNames={{
                spinner: 'notifi-topic-stack-row-input-button-spinner',
              }}
            />
          ) : null}
          <div
            className={clsx(
              'notifi-topic-stack-row-input-button-text',
              isLoadingTopic && 'hidden',
            )}
          >
            {props.copy?.buttonContent ??
              defaultCopy.topicStackRowInput.buttonContent}
          </div>
        </div>
      </div>
    </div>
  );
};
// Utils
const isTopicStackRowInput = (
  props: TopicStackRowInputProps<TopicRowCategory>,
): props is TopicStackGroupRowInputProps => {
  return 'topics' in props;
};
