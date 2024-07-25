import { useUserInputParmToFilterOption } from '@/hooks/useUserInputParmToFilterOption';
import { capitalize } from '@/utils/stringUtils';
import {
  CustomInputConstraints,
  FusionEventTopic,
  UiType,
  UserInputParam,
  ValueType,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiTopicContext } from '@notifi-network/notifi-react';
import React from 'react';

import { TopicRowCategory } from './TopicList';

type TopicGroupOptionsProps = {
  topics: FusionEventTopic[];
  userInputParam: UserInputParam<UiType>;
  index: number;
  description: string;
  onSelectAction?:
    | { actionType: 'instantSubscribe' }
    | {
        actionType: 'updateFilterOptions';
        action: (userInputParamName: string, value: string | number) => void;
      };
};
type TopicStandAloneOptionsProps = {
  topic: FusionEventTopic;
  userInputParam: UserInputParam<UiType>;
  index: number;
  description?: string;
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

  const {
    customInput,
    prefixAndSuffix,
    renewFilterOptions,
    subscribedValue,
    uiType,
    setCustomInput,
    upperBound,
    lowerBound,
    customInputPlaceholder,
  } = useUserInputParmToFilterOption(
    benchmarkTopic.fusionEventDescriptor.id,
    props.userInputParam,
  );

  const { isLoading: isLoadingTopic } = useNotifiTopicContext();

  const [valueToBeSubscribed, setValueToBeSubscribed] = React.useState<
    string | number
  >(props.userInputParam.defaultValue.toString());

  const options = props.userInputParam.options.map((option) =>
    option.toString(),
  );

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const selectedOption =
    props.onSelectAction?.actionType === 'updateFilterOptions'
      ? valueToBeSubscribed
      : subscribedValue;

  const selectOrInputValue = (value: string | number) => {
    if (isLoadingTopic) return;
    value = value.toString();
    if (props.onSelectAction?.actionType === 'updateFilterOptions') {
      if (options.map(String).includes(String(value))) {
        setCustomInput('');
      }
      props.onSelectAction?.action(props.userInputParam.name, value);
      return setValueToBeSubscribed(value);
    }
    renewFilterOptions(value, isTopicGroup ? props.topics : [props.topic]);
  };

  return (
    <div className="">
      {props.userInputParam.description ? (
        <div className="ml-14 text-notifi-text-light text-xs">
          {props.index === 0 ? props.description : ''}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="text-notifi-error text-xs ml-14 mt-2">
          {errorMessage}
        </div>
      ) : null}
      <div
        className={`flex flex-row ml-14 ${
          uiType === 'radio' && !props.userInputParam.options[0]
            ? null
            : 'mt-3 mb-2'
        }`}
      >
        {options.map((option, id) => {
          return (
            <div key={id}>
              {uiType !== 'radio' ? (
                !option ? null : (
                  <button
                    className={`w-16 h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text-light ${
                      option === selectedOption
                        ? 'selected text-white border border-notifi-tenant-brand-bg'
                        : ''
                    }`}
                    onClick={() => {
                      selectOrInputValue(option);
                    }}
                  >
                    <div>
                      {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
                      {option}
                      {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
                    </div>
                  </button>
                )
              ) : !option ? null : (
                <div>
                  <div className="inline-flex items-center mr-6">
                    <label className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        checked={option === selectedOption}
                        onClick={() => {
                          selectOrInputValue(option);
                        }}
                        name={
                          isTopicGroup
                            ? props.topics[0].fusionEventDescriptor.id
                            : props.topic.fusionEventDescriptor.id
                        }
                        type="radio"
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-notifi-text-light text-notifi-tenant-brand-bg transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-notifi-tenant-brand-bg hover:before:opacity-10"
                      />
                      <span className="absolute text-notifi-tenant-brand-bg transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 14 14"
                          fill="#5ECBCC"
                        >
                          <circle
                            data-name="ellipse"
                            cx="7"
                            cy="7"
                            r="7"
                            className="bg-notifi-tenant-brand-bg"
                          ></circle>
                        </svg>
                      </span>
                    </label>
                    <label
                      className="font-light text-notifi-text cursor-pointer select-none ml-2"
                      htmlFor="html"
                    >
                      {capitalize(String(option))}
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {props.userInputParam.allowCustomInput && uiType !== 'radio' ? (
          <div
            className={`text-notifi-text-light inline-block relative ${
              props.userInputParam.options[0] ? 'w-[6.5rem]' : 'w-[247px]'
            }`}
          >
            {props.userInputParam.options[0] ? (
              customInput ? (
                <div className="absolute left-3 bottom-3">
                  {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
                </div>
              ) : null
            ) : (
              <div className="absolute left-3 bottom-3">
                {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
              </div>
            )}
            <input
              disabled={isLoadingTopic}
              onChange={(evt) => {
                setErrorMessage(null);
                if (props.userInputParam.options[0]) {
                  if (
                    Number(evt.target.value) > 99 ||
                    (Number(evt.target.value) < 1 && evt.target.value !== '')
                  ) {
                    setErrorMessage('Please enter a value between 1 and 99');
                  }
                } else {
                  if (
                    lowerBound &&
                    upperBound &&
                    (Number(evt.target.value) > upperBound ||
                      (Number(evt.target.value) < lowerBound &&
                        evt.target.value !== ''))
                  ) {
                    setErrorMessage(
                      `Please enter a value between ${lowerBound} and ${upperBound}`,
                    );
                  } else {
                    if (
                      isUserInputValid(
                        props.userInputParam.kind,
                        evt.target.value,
                        props.userInputParam.customInputConstraints,
                      )
                    ) {
                      selectOrInputValue(evt.target.value);
                    }
                  }
                }
                setCustomInput((prev) => {
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
                if (props.userInputParam.options[0]) {
                  if (
                    Number(evt.target.value) > 99 ||
                    Number(evt.target.value) < 1
                  ) {
                    return;
                  }
                  selectOrInputValue(evt.target.value);
                }
                if (evt.target.value === '') {
                  return options.includes(selectedOption?.toString() ?? '')
                    ? setCustomInput('')
                    : setCustomInput(selectedOption?.toString() ?? '');
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
              placeholder={
                props.userInputParam.kind === 'price'
                  ? 'Enter Price'
                  : customInputPlaceholder
              }
              value={customInput}
              className={` ${
                props.userInputParam.options[0]
                  ? 'w-[6rem] text-center'
                  : `w-full ${
                      'prefix' in prefixAndSuffix && prefixAndSuffix.prefix
                        ? 'pl-7'
                        : 'pl-3'
                    }`
              } h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text ${
                customInput && props.userInputParam.options[0]
                  ? 'selected text-white border border-notifi-tenant-brand-bg focus:outline-none'
                  : 'focus:outline-none focus:border-notifi-card-border'
              }`}
            />
            {props.userInputParam.options[0] ? (
              customInput ? (
                <div className="absolute right-4 bottom-3">
                  {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
                </div>
              ) : null
            ) : (
              <div className="absolute right-3 bottom-3">
                {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
              </div>
            )}
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
  if (userInputValue === '' || userInputValue === '-') return true;
  // 'percentage' and 'price' are deprecated. For legacy support only
  const leadingZeroRegex = /^0\d+/; // regex for leading 0
  if (type === 'percentage' || type === 'price' || type === 'float') {
    // regex for only allow float
    const floatRegex1 = /^-?\d+(\.)?$/; // regex for 0. or -0.
    const floatRegex2 = /^-?\d+(\.\d+)?$/; // regex for float
    const floatWithMaxDecimalPlacesRegex = new RegExp(
      `^-?\\d+(\\.\\d{0,${customInputConstraint?.maxDecimalPlaces ?? 18}})?$`, // If not provided, default to 18 decimal places (EVM bigint limit)
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
      /^-?\d+$/.test(userInputValue.toString()) // regex for only allow integer
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
