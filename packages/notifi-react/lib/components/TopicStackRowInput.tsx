import {
  FusionEventTopic,
  FusionFilterOptions,
  InputObject,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import {
  composeTopicStackAlertName,
  defaultCopy,
  getFusionEventMetadata,
  getUpdatedAlertFilterOptions,
  getUserInputParams,
  isAlertFilter,
} from '../utils';
import { ErrorGlobal } from './ErrorGlobal';
import { LoadingAnimation } from './LoadingAnimation';
import { SubscriptionValueInput } from './SubscriptionValueInput';
import { TopicOptions } from './TopicOptions';

export type TopicStackRowInputProps = {
  classNames?: {
    container?: string;
    button?: string;
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

  const [subscriptionValue, setSubscriptionValue] =
    React.useState<InputObject | null>(null);
  const [filterOptionsToBeSubscribed, setFilterOptionsToBeSubscribed] =
    React.useState<FusionFilterOptions | null>(null);

  // TODO: Move to hooks
  // TODO: use useMemo when it (filters array) possibly grows huge
  const filterName = getFusionEventMetadata(props.topic)?.filters.find(
    isAlertFilter,
  )?.name;

  const userInputParams = getUserInputParams(props.topic);

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
    props.onSave && props.onSave();
  };

  if (topicError) {
    return <ErrorGlobal />; // TODO: handle error
  }

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
      {subscriptionValue && userInputParams.length > 0 ? (
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
                        option,
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
              (!filterOptionsToBeSubscribed ||
                !subscriptionValue ||
                !targetGroupId ||
                !isUserInputParamsValid) &&
                'disabled',
            )}
          >
            {isLoadingTopic ? (
              <LoadingAnimation type={'spinner'} />
            ) : (
              <div onClick={onSave}>
                {props.copy?.buttonContent ??
                  defaultCopy.topicStackRowInput.buttonContent}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
