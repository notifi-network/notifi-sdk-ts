import {
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTopicContext } from '../context';
import { useUserInputParmToFilterOption } from '../hooks/useUserInputParmToFilterOption';
import { defaultCopy } from '../utils';

export type TopicOptionsProps = {
  topics: FusionEventTopic[];
  userInputParam: UserInputParam<UiType>;
  // Others ...
};

export const TopicGroupOptions: React.FC<TopicOptionsProps> = (props) => {
  // TODO1: Validate topicGroup by checking if all topics have the same userInputParams.
  const benchmarkTopic = props.topics[0];

  const {
    customInput,
    prefixAndSuffix,
    renewFilterOptions,
    subscribedValue,
    uiType,
    setCustomInput,
  } = useUserInputParmToFilterOption(
    benchmarkTopic.uiConfig.name,
    props.userInputParam,
  );
  const { isLoading: isLoadingTopic } = useNotifiTopicContext();
  return (
    <div className={clsx('notifi-topic-options')}>
      {props.userInputParam.description ? (
        <div className={clsx('notifi-topic-options-description')}>
          {props.userInputParam.description}
        </div>
      ) : null}

      <div className={clsx('notifi-topic-options-items')}>
        {props.userInputParam.options.map((option) => (
          <div
            className={clsx(
              'notifi-topic-options-item',
              option === subscribedValue ? 'selected' : '',
              uiType === 'button' ? 'button' : 'radio',
            )}
            onClick={() => {
              if (isLoadingTopic) return;
              renewFilterOptions(option, props.topics);
            }}
          >
            <div>
              {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
              {option}
              {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
            </div>
          </div>
        ))}
        {props.userInputParam.allowCustomInput ? (
          <div className="notifi-topic-option-cutom-input-container">
            <div className="notifi-topic-option-custom-input-prefix">
              {prefixAndSuffix.prefix}
            </div>
            <input
              disabled={isLoadingTopic}
              onChange={(evt) => setCustomInput(evt.target.value)}
              onBlur={(evt) => {
                if (!evt.target.value) return;
                renewFilterOptions(evt.target.value, props.topics);
              }}
              className={clsx(
                'notifi-topic-options-custom-input',
                customInput ? 'selected' : '',
              )}
              placeholder={
                // props.copy?.customInputPlaceholder ??
                defaultCopy.topicOptions.customInputPlaceholder
              }
              value={customInput}
            />
            <div className="notifi-topic-option-custom-input-suffix">
              {prefixAndSuffix.suffix}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
