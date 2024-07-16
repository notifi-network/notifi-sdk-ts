import {
  CustomInputConstraints,
  FusionEventTopic,
  UiType,
  UserInputParam,
  ValueType,
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
  if (!benchmarkTopic.fusionEventDescriptor.id) return null;
  /* NOTE: benchmarkTopic is either the 'first topic in the group' or the 'standalone topic'. This represent the target topic to be rendered. */
  const {
    customInput,
    prefixAndSuffix,
    renewFilterOptions,
    subscribedValue,
    uiType,
    setCustomInput,
  } = useUserInputParmToFilterOption(
    benchmarkTopic.fusionEventDescriptor.id,
    props.userInputParam,
  );
  const { isLoading: isLoadingTopic } = useNotifiTopicContext();

  const [valueToBeSubscribed, setValueToBeSubscribed] = React.useState<string>(
    props.userInputParam.defaultValue.toString(),
  );

  const options = props.userInputParam.options.map((option) =>
    option.toString(),
  );

  const selectedOption =
    props.onSelectAction?.actionType === 'updateFilterOptions'
      ? valueToBeSubscribed
      : subscribedValue;

  const selectOrInputValue = (value: string | number) => {
    if (isLoadingTopic) return;
    value = value.toString();
    if (props.onSelectAction?.actionType === 'updateFilterOptions') {
      if (options.includes(value)) {
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
        {options.map((option, id) => (
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
              {option.charAt(0).toUpperCase() + option.slice(1)}
              {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
            </div>
          </div>
        ))}
        {props.userInputParam.allowCustomInput ? (
          <div
            className={clsx(
              'notifi-topic-option-custom-input-container',
              customInput ? 'selected' : '',
            )}
          >
            <div className="notifi-topic-option-custom-input-prefix">
              {prefixAndSuffix.prefix}
            </div>
            <input
              disabled={isLoadingTopic}
              onChange={(evt) => {
                setCustomInput((prev) => {
                  if (evt.target.value === '') return '';
                  if (
                    isUserInputValid(
                      props.userInputParam.kind,
                      evt.target.value,
                      props.userInputParam.customInputConstraints,
                    )
                  ) {
                    return evt.target.value;
                  }
                  return prev;
                });
              }}
              onBlur={(evt) => {
                // 3 cases:
                // Case#1:  If input is empty, reset to current subscribing value
                if (evt.target.value === '') {
                  return options.includes(selectedOption)
                    ? setCustomInput('')
                    : setCustomInput(selectedOption);
                }
                // Case#2: If input === existing selected option, set customInput to empty
                if (
                  options.includes(evt.target.value) &&
                  selectedOption === evt.target.value
                )
                  return setCustomInput('');

                // Case#3: Subscribe new value
                const { value } = validateCustomInputRange(
                  evt.target.value,
                  props.userInputParam.customInputConstraints,
                );
                setCustomInput(value.toString());
                selectOrInputValue(value);
              }}
              className={clsx(
                'notifi-topic-options-custom-input',
                props.classNames?.inputField,
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

const isUserInputValid = (
  type: ValueType,
  userInputValue: string | number,
  customInputConstraint?: CustomInputConstraints,
) => {
  if (userInputValue === '') return true;
  // 'percentage' and 'price' are deprecated. For legacy support only
  const leadingZeroRegex = /^0\d+/; // regex for leading 0
  if (type === 'percentage' || type === 'price' || type === 'float') {
    // regex for only allow float
    const floatRegex1 = /^\d+(\.)?$/; // regex for 0.
    const floatRegex2 = /^\d+(\.\d+)?$/; // regex for float
    const floatWithMaxDecimalPlacesRegex = new RegExp(
      `^\\d+(\\.\\d{0,${customInputConstraint?.maxDecimalPlaces ?? 18}})?$`, // If not provided, default to 18 decimal places (EVM bigint limit)
    );

    return (
      !leadingZeroRegex.test(userInputValue.toString()) &&
      floatWithMaxDecimalPlacesRegex.test(userInputValue.toString()) &&
      (floatRegex1.test(userInputValue.toString()) ||
        floatRegex2.test(userInputValue.toString()))
    );
  }
  if (type === 'integer') {
    return (
      !leadingZeroRegex.test(userInputValue.toString()) &&
      /^\d+$/.test(userInputValue.toString()) // regex for only allow integer
    );
  }
  return true;
};

type CustomInputValidationStatus =
  | 'valid'
  | 'aboveUpperBound'
  | 'belowLowerBound';
const validateCustomInputRange = (
  input: string,
  customInputConstraint?: CustomInputConstraints,
): { status: CustomInputValidationStatus; value: number } => {
  const upperBound = customInputConstraint?.upperBound;
  const lowerBound = customInputConstraint?.lowerBound;
  if (input === '' || isNaN(Number(input)))
    throw new Error('validateCustomInputRange - Input cannot be empty');

  if (
    isNaN(Number(upperBound)) ||
    isNaN(Number(lowerBound)) ||
    !upperBound ||
    !lowerBound
  )
    return { status: 'valid', value: Number(input) };
  if (Number(input) > Number(upperBound))
    return { status: 'aboveUpperBound', value: upperBound };
  if (Number(input) < Number(lowerBound))
    return { status: 'belowLowerBound', value: lowerBound };
  return { status: 'valid', value: Number(input) };
};
