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
} from '../utils';
import { LoadingAnimation } from './LoadingAnimation';
import { SubscriptionValueInput } from './SubscriptionValueInput';
import { TopicOptions } from './TopicOptions';

export type TopicStackRowInputProps = {
  classNames?: {
    container?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
  };
  topic: FusionEventTopic;
  onSave?: () => void;
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
  const { isLoading: isLoadingTopic } = useNotifiTopicContext();

  const filterName = getFusionEventMetadata(props.topic)?.filters.find(
    isAlertFilter,
  )?.name;

  const userInputParams = getUserInputParams(props.topic);

  const {
    subscriptionValue,
    setSubscriptionValue,
    filterOptionsToBeSubscribed,
    setFilterOptionsToBeSubscribed,
    subscribeTopic,
    isTopicReadyToSubscribe,
  } = useTopicStackRowInput(
    props.topic,
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
