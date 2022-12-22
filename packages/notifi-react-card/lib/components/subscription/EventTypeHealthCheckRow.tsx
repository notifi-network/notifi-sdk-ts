import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CheckRatio, HealthCheckEventTypeItem } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

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
  inputs?: Record<string, string | undefined>;
}>;

export const EventTypeHealthCheckRow: React.FC<
  EventTypeHealthCheckRowProps
> = ({
  classNames,
  config,
  disabled,
  inputs,
}: EventTypeHealthCheckRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  // const { instantSubscribe } = useNotifiSubscribe({
  //   targetGroupName: 'Default',
  // });
  const [enabled, setEnabled] = useState(false);
  const [ratios, setRatios] = useState<CheckRatio[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<string>('');
  const [customValue, setCustomValue] = useState<string>('');
  const [cutomButtonPlaceholder, setCustomButtonPlaceholder] =
    useState<string>('Custom');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShowSelectButton, setIsShowSelectButton] = useState<boolean>(false);

  const alertName = useMemo<string>(() => config.name, [config]);
  const tooltipContent = config.tooltipContent;
  useEffect(() => {
    if (loading) {
      return;
    }
    const hasAlert = alerts[alertName] !== undefined;
    setEnabled(hasAlert);
  }, [alertName, alerts, loading]);

  useEffect(() => {
    if (config && config.checkRatios.type === 'value') {
      setRatios(config.checkRatios.value);
    }
  }, [config, setRatios]);

  const handleNewSubscription = () => {
    if (loading) {
      return;
    }
    if (!isShowSelectButton) {
      setIsShowSelectButton(true);
      setEnabled(true);
    } else {
      if (
        customValue.indexOf('%') === customValue.length - 1 &&
        parseFloat(customValue.slice(0, -1)) > 0 &&
        parseFloat(customValue.slice(0, -1)) < 100
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
          setChecked={handleNewSubscription}
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
                    setCustomButtonPlaceholder('Custom');
                    setCustomValue('');
                    setSelectedRatio(percentage);
                    setErrorMessage('');
                  }}
                >
                  {percentage}
                </div>
              );
            })}
            <input
              onClick={() => {
                //assume we should only allow no more than two specific values and one custom value here
                //need to double check with product
                //will update in following PR when connect api
                setSelectedIndex(3);
                setCustomButtonPlaceholder('0.00%');
                setErrorMessage('');
              }}
              value={customValue}
              placeholder={cutomButtonPlaceholder}
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
                setSelectedRatio(e.target.value);
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
