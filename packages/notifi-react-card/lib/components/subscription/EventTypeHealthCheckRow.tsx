import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CheckRatio, HealthCheckEventTypeItem } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

const getParsedInputNumber = (input: string): number | null => {
  if (input.indexOf('%') === input.length - 1) {
    return parseFloat(input.slice(0, -1)) ?? null;
  }
  return null;
};

export type EventTypeHealthCheckRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    content: string;
    button: string;
    buttonContainer: string;
    errorMessage: string;
    toggle: NotifiToggleProps['classNames'];
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: HealthCheckEventTypeItem;
}>;

export const EventTypeHealthCheckRow: React.FC<
  EventTypeHealthCheckRowProps
> = ({ classNames, config, disabled }: EventTypeHealthCheckRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  // const { instantSubscribe } = useNotifiSubscribe({
  //   targetGroupName: 'Default',
  // });
  // const [, setEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShowSelectButton, setIsShowSelectButton] = useState<boolean>(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const tooltipContent = config.tooltipContent;

  const isValueType = config && config.checkRatios.type === 'value';
  let ratios: CheckRatio[] = [];
  if (isValueType) {
    ratios = config.checkRatios.value;
  }

  const enabled = !loading && !!alerts[alertName];

  useEffect(() => {
    if (isValueType) {
      setSelectedRatio(ratios[-1]?.ratio);
      setSelectedIndex(ratios.length - 1);
    }
  }, [isValueType]);

  const handleToggleNewSubscription = () => {
    if (loading) {
      return;
    }
    setIsShowSelectButton(!isShowSelectButton);
    // TODO: hook up API call here
    // if (!enabled) {
    //   instantSubscribe({
    //     alertConfiguration: healthThresholdConfiguration({
    //       alertFrequency: 'ALWAYS',
    //       percentage: selectedRatio,
    //     }),
    //     alertName: alertName,
    //   });
    // } else {
    //   instantSubscribe({
    //     alertConfiguration: null,
    //     alertName: alertName,
    //   });
    // }
  };

  const handleRatioButtonNewSubscription = (ratioNumber: number) => {
    if (loading) {
      return;
    }
    if (ratioNumber) {
      // TODO: hook up API call here
      // instantSubscribe({
      //   alertConfiguration: healthThresholdConfiguration({
      //     alertFrequency: 'ALWAYS',
      //     percentage: selectedRatio,
      //   }),
      //   alertName: alertName,
      // });
    } else {
      setErrorMessage('Please enter a valid number');
    }
  };

  const handleCustomRatioButtonNewSubscription = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (loading) {
      return;
    }
    e.target.placeholder = 'Custom';
    const ratioNumber = getParsedInputNumber(e.target.value);
    if (ratioNumber && ratioNumber >= 1 && ratioNumber <= 99) {
      // TODO: hook up API call here
      // instantSubscribe({
      //   alertConfiguration: healthThresholdConfiguration({
      //     alertFrequency: 'ALWAYS',
      //     percentage: ratioNumber,
      //   }),
      //   alertName: alertName,
      // });
    } else {
      if (
        customValue.indexOf('%') === customValue.length - 1 &&
        parseFloat(customValue.slice(0, -1)) >= 1 &&
        parseFloat(customValue.slice(0, -1)) <= 99
      ) {
        console.log(selectedRatio);
        return;
        //TODO: hook up API call here
        // if (!enabled) {
        //   instantSubscribe({
        //     alertConfiguration: alertConfiguration,
        //     alertName: alertName,
        //   });
        // } else {
        //   instantSubscribe({
        //     alertConfiguration: null,
        //     alertName: alertName,
        //   });
        // }
      } else {
        setErrorMessage('Please enter a valid number');
      }
    }
  };

  return (
    <div>
      <div
        className={clsx(
          'EventTypeHealthCheckRow__container',
          classNames?.container,
        )}
      >
        <div
          className={clsx('EventTypeHealthCheckRow__label', classNames?.label)}
        >
          {config.name}
          {tooltipContent !== undefined && tooltipContent.length > 0 ? (
            <NotifiTooltip
              classNames={classNames?.tooltip}
              content={tooltipContent}
            />
          ) : null}
        </div>
        <NotifiToggle
          checked={enabled}
          classNames={classNames?.toggle}
          disabled={disabled}
          setChecked={handleToggleNewSubscription}
        />
      </div>
      {isShowSelectButton ? (
        <>
          <div
            className={clsx(
              'EventTypeHealthCheckRow__content',
              classNames?.content,
            )}
          >
            Alert me when my margin ratio is {ratios[0]?.type}
          </div>
          <div
            className={clsx(
              'EventTypeHealthCheckRow__buttonContainer',
              classNames?.buttonContainer,
            )}
          >
            {ratios.map((value, index) => {
              const percentage = value.ratio * 100 + '%';
              return (
                <div
                  key={index}
                  className={clsx(
                    'EventTypeHealthCheckRow__button',
                    `${
                      index === selectedIndex
                        ? ' EventTypeHealthCheckRow__buttonSelected'
                        : undefined
                    }`,
                    classNames?.button,
                  )}
                  onClick={() => {
                    setSelectedIndex(index);
                    setCustomValue('');
                    setSelectedRatio(value.ratio);
                    setErrorMessage('');
                    handleRatioButtonNewSubscription(value.ratio);
                  }}
                >
                  {percentage}
                </div>
              );
            })}
            <input
              onFocus={(e) => (e.target.placeholder = '0.00%')}
              onClick={() => {
                //assume we should only allow no more than two specific values and one custom value here
                //need to double check with product
                //will update in following PR when connect api
                setSelectedRatio(null);
                setSelectedIndex(3);
                setErrorMessage('');
              }}
              onBlur={handleCustomRatioButtonNewSubscription}
              value={customValue}
              placeholder="Custom"
              className={clsx(
                'EventTypeHealthCheckRow__button',
                'EventTypeHealthCheckRow__customButton',
                `${
                  selectedIndex === 3
                    ? ' EventTypeHealthCheckRow__buttonSelected'
                    : undefined
                }`,
                classNames?.button,
              )}
              onChange={(e) => {
                setCustomValue(e.target.value ?? '');
              }}
            />
          </div>
          <label
            className={clsx(
              'NotifiEmailInput__errorMessage',
              classNames?.errorMessage,
            )}
          >
            {errorMessage}
          </label>
        </>
      ) : null}
    </div>
  );
};
