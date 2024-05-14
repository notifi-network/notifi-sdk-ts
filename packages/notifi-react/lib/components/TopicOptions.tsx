import {
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTopicContext } from '../context';
import { useUserInputParmToFilterOption } from '../hooks/useUserInputParmToFilterOption';
import { defaultCopy } from '../utils/constants';
import { TopicRowCategory } from './TopicList';

type TopicGroupOptionsProps = TopicOptionsPropsBase & {
  topics: FusionEventTopic[];
  userInputParam: UserInputParam<UiType>;
};
type TopicStandAloneOptionsProps = TopicOptionsPropsBase & {
  topic: FusionEventTopic;
  userInputParam: UserInputParam<UiType>;
};

export type TopicOptionsPropsBase = {
  classNames?: {
    container?: string;
    discription?: string;
    items?: string;
    item?: string;
    inputField?: string;
  };
  copy?: {
    customInputPlaceholder?: string;
  };
  onSelectAction?:
    | { actionType: 'instantSubscribe' }
    | {
        actionType: 'updateFilterOptions';
        action: (userInputParamName: string, value: string | number) => void;
      };
};

export type TopicOptionsProps<T extends TopicRowCategory> =
  T extends 'standalone' ? TopicStandAloneOptionsProps : TopicGroupOptionsProps;

export const TopicOptions = <T extends TopicRowCategory>(
  props: TopicOptionsProps<T>,
) => {
  const isTopicGroup = isTopicGroupOptions(props);
  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;
  /* NOTE: benchmarkTopic is either the 'first topic in the group' or the 'standalone topic'. This represent the target topic to be rendered. */
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

  const [valueToBeSubscribed, setValueToBeSubscribed] = React.useState<
    string | number
  >(props.userInputParam.defaultValue);

  const selectedOption =
    props.onSelectAction?.actionType === 'updateFilterOptions'
      ? valueToBeSubscribed
      : subscribedValue;

  const selectOrInputValue = (value: string | number) => {
    if (isLoadingTopic) return;
    if (props.onSelectAction?.actionType === 'updateFilterOptions') {
      if (props.userInputParam.options.includes(value)) {
        setCustomInput('');
      }
      props.onSelectAction?.action(props.userInputParam.name, value);
      return setValueToBeSubscribed(value);
    }
    renewFilterOptions(value, isTopicGroup ? props.topics : [props.topic]);
  };

  return (
    <div className={clsx('notifi-topic-options', props.classNames?.container)}>
      {props.userInputParam.description ? (
        <div
          className={clsx(
            'notifi-topic-options-description',
            props.classNames?.discription,
          )}
        >
          {props.userInputParam.description}
        </div>
      ) : null}

      <div
        className={clsx('notifi-topic-options-items', props.classNames?.items)}
      >
        {props.userInputParam.options.map((option, id) => (
          <div
            key={id}
            className={clsx(
              'notifi-topic-options-item',
              props.classNames?.item,
              option === selectedOption ? 'selected' : '',
              uiType === 'button' ? 'button' : 'radio',
            )}
            onClick={() => {
              selectOrInputValue(option);
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
                selectOrInputValue(evt.target.value);
              }}
              className={clsx(
                'notifi-topic-options-custom-input',
                props.classNames?.inputField,
                customInput ? 'selected' : '',
              )}
              placeholder={
                props.copy?.customInputPlaceholder ??
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

// Utils
const isTopicGroupOptions = (
  props: TopicOptionsProps<TopicRowCategory>,
): props is TopicGroupOptionsProps => {
  return 'topics' in props;
};
