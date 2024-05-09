import { useUserInputParmToFilterOption } from '@/hooks/useUserInputParmToFilterOption';
import {
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiTopicContext } from '@notifi-network/notifi-react';
import React from 'react';

import { AlertSubscriptionTopicRowCategory } from './AlertSubscription';

type AlertSubscriptionTopicGroupOptionsProps = {
  topics: FusionEventTopic[];
  userInputParam: UserInputParam<UiType>;
  index: number;
  description: string;
};
type AlertSubscriptionTopicStandAloneOptionsProps = {
  topic: FusionEventTopic;
  userInputParam: UserInputParam<UiType>;
  index: number;
  description: string;
};

export type AlertSubscriptionOptionsProps<
  T extends AlertSubscriptionTopicRowCategory,
> = T extends 'standalone'
  ? AlertSubscriptionTopicStandAloneOptionsProps
  : AlertSubscriptionTopicGroupOptionsProps;

export const AlertSubscriptionOptions = <
  T extends AlertSubscriptionTopicRowCategory,
>(
  props: AlertSubscriptionOptionsProps<T>,
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

  return (
    <div className="">
      {props.userInputParam.description ? (
        <div className="ml-14 text-notifi-text-light text-xs">
          {props.index === 0 ? props.description : ''}
        </div>
      ) : null}

      <div className="flex flex-row ml-14 mt-3 mb-2">
        {props.userInputParam.options.map((option) => {
          return (
            <>
              {uiType !== 'radio' ? (
                !option ? null : (
                  <button
                    className={`w-18 h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text-light ${
                      option === subscribedValue
                        ? 'selected text-white border border-notifi-tenant-brand-bg'
                        : ''
                    }`}
                    onClick={() => {
                      if (isLoadingTopic) return;
                      renewFilterOptions(
                        option,
                        isTopicGroup ? props.topics : [props.topic],
                      );
                    }}
                  >
                    <div>
                      {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
                      {option}
                      {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
                    </div>
                  </button>
                )
              ) : (
                <div>
                  <div className="inline-flex items-center mr-6">
                    <label className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        onClick={() => {
                          if (isLoadingTopic) return;
                          // renewFilterOptions(
                          //   option,
                          //   isTopicGroup ? props.topics : [props.topic],
                          // );
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
                      {option}
                    </label>
                  </div>
                </div>
              )}
            </>
          );
        })}
        {props.userInputParam.allowCustomInput && uiType !== 'radio' ? (
          <div
            className={`text-notifi-text-light inline-block relative ${
              props.userInputParam.options[0] ? '' : 'w-60'
            }`}
          >
            {props.userInputParam.options[0]
              ? 'prefix' in prefixAndSuffix && prefixAndSuffix.prefix
              : null}
            <input
              disabled={isLoadingTopic}
              onChange={(evt) => setCustomInput(evt.target.value)}
              onBlur={(evt) => {
                if (!evt.target.value) return;
                renewFilterOptions(
                  evt.target.value,
                  isTopicGroup ? props.topics : [props.topic],
                );
              }}
              placeholder="Custom"
              value={customInput}
              className={` ${
                props.userInputParam.options[0] ? 'w-20' : 'w-full'
              } h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text-light text-center mx-1 ${
                customInput === subscribedValue
                  ? 'selected text-white border border-notifi-tenant-brand-bg'
                  : ''
              }`}
            />
            {props.userInputParam.options[0] ? null : (
              <div className="absolute right-0 bottom-3">
                {'prefix' in prefixAndSuffix && prefixAndSuffix.prefix}
              </div>
            )}
            {'suffix' in prefixAndSuffix && prefixAndSuffix.suffix}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Utils
const isTopicGroupOptions = (
  props: AlertSubscriptionOptionsProps<AlertSubscriptionTopicRowCategory>,
): props is AlertSubscriptionTopicGroupOptionsProps => {
  return 'topics' in props;
};
