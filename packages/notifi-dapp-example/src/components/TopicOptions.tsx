import { useUserInputParmToFilterOption } from '@/hooks/useUserInputParmToFilterOption';
import { capitalize } from '@/utils/stringUtils';
import {
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
  placeholder?: string;
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
  placeholder?: string;
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

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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
    <div className="">
      {props.userInputParam.description ? (
        <div className="ml-14 text-notifi-text-light text-xs">
          {props.index === 0 ? props.description : ''}
        </div>
      ) : null}

      <div className="text-notifi-error text-xs ml-14 mt-2">{errorMessage}</div>
      <div className="flex flex-row ml-14 mt-3 mb-2">
        {props.userInputParam.options.map((option, id) => {
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
                        checked={valueToBeSubscribed === option}
                        onClick={() => {
                          selectOrInputValue(option);
                        }}
                        name="type"
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
            {props.userInputParam.options[0]
              ? 'prefix' in prefixAndSuffix && prefixAndSuffix.prefix
              : null}
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
                    isUserInputValid(
                      props.userInputParam.kind,
                      evt.target.value,
                    )
                  ) {
                    selectOrInputValue(evt.target.value);
                  }
                }
                setCustomInput((prev) => {
                  if (
                    isUserInputValid(
                      props.userInputParam.kind,
                      evt.target.value,
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
              }}
              placeholder={props.placeholder ?? 'Custom'}
              value={customInput}
              className={` ${
                props.userInputParam.options[0]
                  ? 'w-[6rem] text-center'
                  : 'w-full pl-3'
              } h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text ${
                customInput && props.userInputParam.options[0]
                  ? 'selected text-white border border-notifi-tenant-brand-bg focus:outline-none'
                  : 'focus:outline-none focus:border-notifi-card-border'
              }`}
            />
            {props.userInputParam.options[0] ? null : (
              <div className="absolute right-3 bottom-3">
                {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
              </div>
            )}
            {customInput ? (
              <div className="absolute right-4 bottom-3">
                {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
              </div>
            ) : null}
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

const isUserInputValid = (type: ValueType, userInputValue: string | number) => {
  if (userInputValue === '') return true;
  if (type === 'percentage' || type === 'price') {
    // regex for only allow float
    const regex1 = /^\d+(\.)?$/;
    const regex2 = /^\d{1,6}(\.\d{1,6})?$/;
    return (
      regex1.test(userInputValue.toString()) ||
      regex2.test(userInputValue.toString())
    );
  }
  if (type === 'integer') {
    // regex for only allow integer
    return /^\d+$/.test(userInputValue.toString());
  }
  return true;
};
