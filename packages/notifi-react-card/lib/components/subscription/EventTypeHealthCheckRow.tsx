import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import {
  CheckRatio,
  HealthCheckEventTypeItem,
  useNotifiSubscribe,
} from '../../hooks';
import { DeepPartialReadonly, healthThresholdConfiguration } from '../../utils';
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
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const alertName = useMemo<string>(() => config.name, [config]);
  const tooltipContent = config.tooltipContent;

  const isValueType = config && config.checkRatios.type === 'value';
  let ratios: CheckRatio[] = [];
  if (isValueType) {
    ratios = config.checkRatios.value;
  }

  useEffect(() => {
    if (loading) {
      return;
    }
    const alert = alerts[alertName];
    const checkRatios = ratios.map((ratio) => ratio.ratio);
    if (alert) {
      const alertRatioValue = JSON.parse(alert.filterOptions ?? '').threshold;
      setEnabled(true);
      ratios.forEach((ratio, index) => {
        if (ratio.ratio === alertRatioValue && customValue === '') {
          setSelectedIndex(index);
        }
      });
      setInitialRatio(alertRatioValue);
      if (!checkRatios.includes(alertRatioValue) && customValue === '') {
        setSelectedIndex(3);
        setCustomValue(alertRatioValue * 100 + '%');
      }
    } else {
      setEnabled(false);
      setSelectedIndex(ratios.length - 1);
      setInitialRatio(ratios[ratios.length - 1]?.ratio);
    }
  }, [
    alertName,
    alerts,
    loading,
    ratios,
    setEnabled,
    setCustomValue,
    setSelectedIndex,
  ]);

  const handleToggleNewSubscription = useCallback(() => {
    if (loading) {
      return;
    }
    if (!enabled && initialRatio) {
      instantSubscribe({
        alertConfiguration: healthThresholdConfiguration({
          alertFrequency: 'DAILY',
          percentage: initialRatio,
        }),
        alertName: alertName,
      });
    } else {
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      });
    }
  }, [initialRatio, enabled, isValueType]);

  const handleRatioButtonNewSubscription = (value: number, index: number) => {
    setCustomValue('');
    setErrorMessage('');
    if (loading) {
      return;
    }
    if (value) {
      instantSubscribe({
        alertConfiguration: healthThresholdConfiguration({
          alertFrequency: 'DAILY',
          percentage: value,
        }),
        alertName: alertName,
      })
        .then(() => setSelectedIndex(index))
        .catch(() => setErrorMessage('Unable to subscribe, please try again'));
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
    if (ratioNumber && ratioNumber >= 1 && ratioNumber <= 99 && customValue) {
      instantSubscribe({
        alertConfiguration: healthThresholdConfiguration({
          alertFrequency: 'DAILY',
          percentage: ratioNumber / 100,
        }),
        alertName: alertName,
      })
        .then(() => setSelectedIndex(3))
        .catch(() => setErrorMessage('Unable to subscribe, please try again'));
    } else {
      setErrorMessage('Please enter a valid number');
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
      {enabled ? (
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
                    handleRatioButtonNewSubscription(value.ratio, index);
                  }}
                >
                  {percentage}
                </div>
              );
            })}
            <input
              onFocus={(e) => (e.target.placeholder = '0.00%')}
              onClick={() => {
                setErrorMessage('');
                setSelectedIndex(null);
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
