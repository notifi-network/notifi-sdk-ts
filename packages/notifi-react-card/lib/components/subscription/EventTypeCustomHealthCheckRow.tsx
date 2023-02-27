import { ThresholdDirection } from '@notifi-network/notifi-core';
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
import { DeepPartialReadonly, customThresholdConfiguration } from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

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
  inputs,
}: EventTypeCustomHealthCheckRowProps) => {
  const { alerts, loading } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const [enabled, setEnabled] = useState(false);
  // This indicates which box to select
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [initialSelectedIndex, setInitialSelectedIndex] = useState<
    number | null
  >(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  const [isNotificationLoading, setIsNotificationLoading] =
    useState<boolean>(false);

  const [customValue, setCustomValue] = useState<string>('');
  const customInputRef = useRef<HTMLInputElement>(null);
  const thresholdDirection: ThresholdDirection = 'below';

  const [errorMessage, setErrorMessage] = useState<string>('');

  const alertName = useMemo<string>(() => config.name, [config]);

  const tooltipContent = config.tooltipContent;

  const UNABLE_TO_SUBSCRIBE = 'Unable to subscribe, please try again';
  const UNABLE_TO_UNSUBSCRIBE = 'Unable to unsubscribe, please try again';
  const INVALID_NUMBER = 'Please enter a valid number';

  if (config.selectedUIType !== 'HEALTH_CHECK') {
    return null;
  }
  useEffect(() => {
    if (loading || isNotificationLoading) {
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
            setInitialSelectedIndex(index);
          }
        });
        setInitialRatio(alertRatioValue);
        if (!checkRatios.includes(alertRatioValue) && customValue === '') {
          setSelectedIndex(3);
          setCustomValue(
            config.numberType === 'percentage'
              ? alertRatioValue + '%'
              : alertRatioValue.toString(),
          );
        }
      }
    } else {
      setEnabled(false);
      setSelectedIndex(ratios.length - 1);
      setInitialRatio(ratios[ratios.length - 1]?.ratio);
    }
  }, [alertName, alerts, loading, enabled, setEnabled, isNotificationLoading]);

  const handleCustomRatioButtonNewSubscription = () => {
    if (loading || isNotificationLoading) {
      return;
    }

    setErrorMessage('');
    setIsNotificationLoading(true);
    if (customInputRef.current) {
      customInputRef.current.placeholder = 'Custom';

      const ratioNumber =
        config.numberType === 'percentage'
          ? getParsedInputNumber(customInputRef.current.value)
          : parseFloat(customInputRef.current.value);

      if (ratioNumber && customValue) {
        const checkRatios = config.checkRatios;

        const thresholdDirection = checkRatios[0].type ?? 'below';

        instantSubscribe({
          alertConfiguration: customThresholdConfiguration({
            sourceType: config.sourceType,
            filterType: config.filterType,
            alertFrequency: config.alertFrequency,
            sourceAddress: resolveStringRef(
              alertName,
              config.sourceAddress,
              inputs,
            ),
            thresholdDirection: thresholdDirection,
            threshold:
              config.numberType === 'percentage'
                ? ratioNumber / 100
                : ratioNumber,
          }),
          alertName,
        })
          .then(() => setSelectedIndex(3))
          .catch(() => setErrorMessage(UNABLE_TO_UNSUBSCRIBE))
          .finally(() => {
            setIsNotificationLoading(false);
          });
      } else {
        setErrorMessage(INVALID_NUMBER);
        setSelectedIndex(initialSelectedIndex);
        setIsNotificationLoading(false);
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
    if (loading || isNotificationLoading) {
      return;
    }
    setIsNotificationLoading(true);

    setErrorMessage('');
    if (value) {
      instantSubscribe({
        alertConfiguration: customThresholdConfiguration({
          sourceType: config.sourceType,
          filterType: config.filterType,
          alertFrequency: config.alertFrequency,
          sourceAddress: resolveStringRef(
            alertName,
            config.sourceAddress,
            inputs,
          ),
          thresholdDirection: thresholdDirection,
          threshold: value,
        }),
        alertName,
      })
        .then(() => {
          setSelectedIndex(index);
          setCustomValue('');
        })
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE))
        .finally(() => {
          setIsNotificationLoading(false);
        });
    } else {
      setErrorMessage(INVALID_NUMBER);
      setIsNotificationLoading(false);
    }
  };

  const handleHealthCheckSubscription = useCallback(() => {
    if (loading || isNotificationLoading) {
      return;
    }
    setIsNotificationLoading(true);
    setErrorMessage('');
    if (!enabled && initialRatio !== null) {
      setEnabled(true);

      instantSubscribe({
        alertConfiguration: customThresholdConfiguration({
          sourceType: config.sourceType,
          filterType: config.filterType,
          alertFrequency: config.alertFrequency,
          sourceAddress: resolveStringRef(
            alertName,
            config.sourceAddress,
            inputs,
          ),
          thresholdDirection: thresholdDirection,
          threshold: initialRatio,
        }),
        alertName,
      })
        .then((res) => {
          // We update optimistically so we need to check if the alert exists.
          const responseHasAlert = res.alerts[alertName] !== undefined;
          if (responseHasAlert !== true) {
            setEnabled(false);
          }
        })
        .catch(() => {
          setErrorMessage(UNABLE_TO_SUBSCRIBE);
          setEnabled(false);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    } else {
      setEnabled(false);
      instantSubscribe({
        alertConfiguration: null,
        alertName: alertName,
      })
        .then((res) => {
          setCustomValue('');
          const responseHasAlert = res.alerts[alertName] !== undefined;

          if (responseHasAlert !== false) {
            setEnabled(true);
          }
        })
        .catch(() => {
          setErrorMessage(UNABLE_TO_SUBSCRIBE);
          setEnabled(true);
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    }
  }, [initialRatio, enabled, isNotificationLoading, setIsNotificationLoading]);

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
          disabled={disabled || isNotificationLoading}
          setChecked={handleHealthCheckSubscription}
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
                    isNotificationLoading ? 'buttonDisabled' : undefined,
                    classNames?.button,
                  )}
                  onClick={() => {
                    if (
                      isNotificationLoading === true ||
                      selectedIndex === index
                    ) {
                      return;
                    }

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
              disabled={isNotificationLoading}
              type="number"
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
