import {
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import {
  derivePrefixAndSuffixFromValueType,
  getUpdatedAlertFilterOptions,
} from '../utils';
import { defaultCopy } from '../utils/constants';

export type TopicOptionsProps = {
  topic: FusionEventTopic;
  userInputParam: UserInputParam<UiType>;
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
};

export const TopicOptions: React.FC<TopicOptionsProps> = (props) => {
  const {
    getAlertFilterOptions,
    subscribeAlertsWithFilterOptions,
    isLoading: isLoadingTopic,
  } = useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();
  const alertFilterOptions = getAlertFilterOptions(props.topic.uiConfig.name);

  const filterName: string | undefined = Object.keys(
    alertFilterOptions?.input ?? [],
  )[0]; // NOTE: Only consider 1 to 1 relationship (1 filter for 1 topic)
  const userInputOptions = alertFilterOptions?.input[filterName];

  const subscribedValue = userInputOptions?.[props.userInputParam.name];

  const [customInput, setCustomInput] = React.useState<string | number>();
  React.useEffect(() => {
    if (
      !!subscribedValue &&
      !props.userInputParam.options.includes(subscribedValue)
    ) {
      setCustomInput(subscribedValue);
      return;
    }
    setCustomInput('');
  }, [subscribedValue]);

  const uiType = props.userInputParam.uiType;

  const prefixAndSuffix = derivePrefixAndSuffixFromValueType(
    props.userInputParam.kind,
  );

  const renewFilterOptions = async (
    option: number | string,
    topics: FusionEventTopic[],
  ) => {
    if (!alertFilterOptions || !targetGroupId) return;
    const updatedAlertFilterOptiopns = getUpdatedAlertFilterOptions(
      filterName,
      alertFilterOptions,
      props.userInputParam.name,
      option,
    );
    topics.map((topic) => {
      return {
        topic: topic,
        filterOptions: updatedAlertFilterOptiopns,
      };
    });
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
        {props.userInputParam.options.map((option) => (
          <div
            className={clsx(
              'notifi-topic-options-item',
              props.classNames?.item,
              option === subscribedValue ? 'selected' : '',
              uiType === 'button' ? 'button' : 'radio',
            )}
            onClick={() => {
              if (isLoadingTopic) return;
              renewFilterOptions(option, [props.topic]);
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
                renewFilterOptions(evt.target.value, [props.topic]);
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

// const getUpdatedAlertFilterOptions = (
//   filterName: string,
//   alertFilterOptions: FusionFilterOptions,
//   inputParmName: string,
//   value: string | number,
// ) => {
//   return {
//     ...alertFilterOptions,
//     input: {
//       ...alertFilterOptions.input,
//       [filterName]: {
//         ...alertFilterOptions.input[filterName],
//         [inputParmName]: value,
//       },
//     },
//   };
// };

// const derivePrefixAndSuffixFromValueType = (
//   kind: ValueType,
// ): { prefix: string; suffix: string } => {
//   switch (kind) {
//     case 'price':
//       return {
//         prefix: '$',
//         suffix: '',
//       };
//     case 'percentage':
//       return {
//         prefix: '',
//         suffix: '%',
//       };
//     case 'string':
//     case 'integer':
//       return {
//         prefix: '',
//         suffix: '',
//       };
//   }
// };
