import {
  AlertFrequency,
  ThresholdDirection,
} from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CustomTopicTypeItem, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly, healthThresholdConfiguration } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';

export type EventTypeCustomHealthCheckRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    content: string;
    button: string;
    toggle: NotifiToggleProps['classNames'];
    buttonContainer: string;
    errorMessage: string;
    tooltip: NotifiTooltipProps['classNames'];
  }>;
  disabled: boolean;
  config: CustomTopicTypeItem;
  inputs: Record<string, unknown>;
}>;

const getParsedInputNumber = (input: string): number | null => {
  if (input.indexOf('%') === input.length - 1) {
    return parseFloat(input.slice(0, -1)) ?? null;
  }
  return null;
};

export const EventTypeCustomHealthCheckRow: React.FC<
  EventTypeCustomHealthCheckRowProps
> = ({
  classNames,
  config,
  disabled,
}: // inputs,
EventTypeCustomHealthCheckRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);
  // This indicates which box to select
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const customInputRef = useRef<HTMLInputElement>(null);
  const thresholdDirection: ThresholdDirection = 'below';

  const [errorMessage, setErrorMessage] = useState<string>('');

  const alertName = useMemo<string>(() => config.name, [config]);

  const tooltipContent = config.tooltipContent;

  const UNABLE_TO_SUBSCRIBE = 'Unable to subscribe, please try again';
  const INVALID_NUMBER = 'Please enter a valid number';

  useEffect(() => {
    if (loading) {
      return;
    }

    const ratios = config.checkRatios ?? [];
    const checkRatios = ratios.map((ratio) => ratio.ratio);

    const alert = alerts[alertName];

    if (alert) {
      let alertRatioValue: number | null = null;
      if (alert.filterOptions) {
        alertRatioValue = JSON.parse(alert.filterOptions).threshold;
      }
      setEnabled(true);
      if (alertRatioValue) {
        ratios.forEach((ratio, index) => {
          if (ratio.ratio === alertRatioValue && customValue === '') {
            setSelectedIndex(index);
          }
        });
        setInitialRatio(alertRatioValue);
        if (!checkRatios.includes(alertRatioValue) && customValue === '') {
          setSelectedIndex(3);
          setCustomValue(alertRatioValue + '%');
        }
      }
    } else {
      setEnabled(false);
      setSelectedIndex(ratios.length - 1);
      setInitialRatio(ratios[ratios.length - 1]?.ratio);
    }
  }, [alertName, alerts, loading]);

  const handleCustomRatioButtonNewSubscription = () => {
    if (loading) {
      return;
    }

    setErrorMessage('');
    if (customInputRef.current) {
      customInputRef.current.placeholder = 'Custom';

      const ratioNumber =
        config.numberType === 'percentage'
          ? getParsedInputNumber(customInputRef.current.value)
          : parseFloat(customInputRef.current.value);

      if (ratioNumber && customValue) {
        const checkRatios = config.checkRatios ?? [];

        const thresholdDirection = checkRatios[0].type ?? 'below';
        instantSubscribe({
          alertConfiguration: healthThresholdConfiguration({
            alertFrequency: config?.alertFrequency ?? 'HOURLY',
            percentage: ratioNumber / 100,
            thresholdDirection: thresholdDirection,
          }),
          alertName: alertName,
        })
          .then(() => setSelectedIndex(3))
          .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE));
      } else {
        setErrorMessage(INVALID_NUMBER);
      }
    }
  };

  const handleKeypressUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (customInputRef.current) {
        customInputRef.current.blur();
        event.preventDefault();
      }
    }
  };
  const handleRatioButtonNewSubscription = (value: number, index: number) => {
    if (loading) {
      return;
    }
    setErrorMessage('');
    if (value) {
      instantSubscribe({
        alertConfiguration: healthThresholdConfiguration({
          alertFrequency: config.alertFrequency,
          percentage: value,
          thresholdDirection,
        }),
        alertName: alertName,
      })
        .then(() => {
          setSelectedIndex(index);
          setCustomValue('');
        })
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE));
    } else {
      setErrorMessage(INVALID_NUMBER);
    }
  };

  const handleHealthCheckSubscription = useCallback(() => {
    if (loading) {
      return;
    }
    setErrorMessage('');
    if (!enabled && initialRatio !== null) {
      instantSubscribe({
        alertConfiguration: healthThresholdConfiguration({
          alertFrequency: config.alertFrequency ?? ('SINGLE' as AlertFrequency),
          percentage: initialRatio,
          thresholdDirection,
        }),
        alertName: alertName,
      }).catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE));
    } else {
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      })
        .then(() => setCustomValue(''))
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE));
    }
  }, [initialRatio, enabled]);

  return (
    <div>
      <div
        className={clsx(
          'EventTypeCustomHealthCheckRow__container',
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
          setChecked={
            config.selectedUIType === 'HEALTH_CHECK'
              ? handleHealthCheckSubscription
              : () => {
                  // to do
                }
          }
        />
      </div>
      {enabled && config.checkRatios?.length ? (
        <>
          <div
            className={clsx(
              'EventTypeHealthCheckRow__content',
              classNames?.content,
            )}
          >
            {config.healthCheckSubtitle
              ? config.healthCheckSubtitle
              : `Alert me when my margin ratio is ${config.checkRatios[0]?.type}`}
          </div>
          <div
            className={clsx(
              'EventTypeHealthCheckRow__buttonContainer',
              classNames?.buttonContainer,
            )}
          >
            {config.checkRatios.map((value, index) => {
              const numberType = config.numberType;

              const percentage = value.ratio + '%';
              const valueToShow =
                numberType === 'percentage' ? percentage : value.ratio;
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
                  {valueToShow}
                </div>
              );
            })}
            <input
              ref={customInputRef}
              onKeyUp={(e) => handleKeypressUp(e)}
              onFocus={(e) =>
                (e.target.placeholder =
                  config.numberType === 'percentage' ? '0.00' : '0')
              }
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
