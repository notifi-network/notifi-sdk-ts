import {
  FusionEventTopic,
  FusionFilterOptions,
  UiType,
  UserInputParam,
  ValueType,
} from '@notifi-network/notifi-frontend-client';
import {
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

export type TopicOptionsProps = {
  topic: FusionEventTopic;
  userInputParam: UserInputParam<UiType>;
  description: string;
  index: number;
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

export const AlertSubscriptionOptions: React.FC<TopicOptionsProps> = (
  props,
) => {
  const {
    getAlertFilterOptions,
    subscribeAlertsWithFilterOptions,
    isLoading: isLoadingTopic,
  } = useNotifiTopicContext();
  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  // TODO: Implement the following logic

  // const alertFilterOptions = getAlertFilterOptions(props.topic.uiConfig.name);
  // console.log('props.topic.uiConfig.name', alertFilterOptions);

  // const filterName: string | undefined = Object.keys(
  //   alertFilterOptions?.input ?? [],
  // )[0]; // NOTE: Only consider 1 to 1 relationship (1 filter for 1 topic)
  // const userInputOptions = alertFilterOptions?.input[filterName];

  // const subscribedValue = userInputOptions?.[props.userInputParam.name];

  const [customInput, setCustomInput] = React.useState<string | number>('');
  // React.useEffect(() => {
  //   if (
  //     !!subscribedValue &&
  //     !props.userInputParam.options.includes(subscribedValue)
  //   ) {
  //     setCustomInput(subscribedValue);
  //     return;
  //   }
  //   setCustomInput('');
  // }, [subscribedValue]);

  const uiType = props.userInputParam.uiType;
  console.log('uiType', uiType);

  const prefixAndSuffix = getPrefixAndSuffix(props.userInputParam.kind);
  // const renewFilterOptions = async (option: number | string) => {
  //   console.log('alertFilterOptions', alertFilterOptions);
  //   if (!alertFilterOptions || !targetGroupId) return;
  //   const updatedAlertFilterOptiopns = getUpdatedAlertFilterOptions(
  //     filterName,
  //     alertFilterOptions,
  //     props.userInputParam.name,
  //     option,
  //   );
  //   console.log('clicked');
  //   await subscribeAlertsWithFilterOptions(
  //     [
  //       {
  //         topic: props.topic,
  //         filterOptions: updatedAlertFilterOptiopns,
  //       },
  //     ],
  //     targetGroupId,
  //   );
  // };

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
              {uiType === 'button' ? (
                !option ? null : (
                  <button
                    className={`w-18 h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text-light`}
                    // ${
                    //   option === subscribedValue
                    //     ? 'selected text-white border border-notifi-tenant-brand-bg'
                    //     : ''
                    // }

                    onClick={() => {
                      if (isLoadingTopic) return;
                      console.log('before');
                      // renewFilterOptions(option);
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
        {props.userInputParam.allowCustomInput && uiType === 'button' ? (
          <div className="text-notifi-text-light inline-block relative w-60">
            {props.userInputParam.options[0]
              ? 'prefix' in prefixAndSuffix && prefixAndSuffix.prefix
              : null}
            <input
              disabled={isLoadingTopic}
              onChange={(evt) => setCustomInput(evt.target.value)}
              onBlur={(evt) => {
                if (!evt.target.value) return;
                // renewFilterOptions(evt.target.value);
              }}
              placeholder="Custom"
              value={customInput}
              className={` ${
                props.userInputParam.options[0] ? 'w-20' : 'w-full'
              } h-12 bg-notifi-card-bg rounded-md mr-2 text-notifi-text-light text-center mx-1`}
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

const getUpdatedAlertFilterOptions = (
  filterName: string,
  alertFilterOptions: FusionFilterOptions,
  inputParmName: string,
  value: string | number,
) => {
  return {
    ...alertFilterOptions,
    input: {
      ...alertFilterOptions.input,
      [filterName]: {
        ...alertFilterOptions.input[filterName],
        [inputParmName]: value,
      },
    },
  };
};

const getPrefixAndSuffix = (
  kind: ValueType,
): { prefix: string; suffix: string } => {
  switch (kind) {
    case 'price':
      return {
        prefix: '$',
        suffix: '',
      };
    case 'percentage':
      return {
        prefix: '',
        suffix: '%',
      };
    case 'string':
    case 'integer':
      return {
        prefix: '',
        suffix: '',
      };
  }
};
