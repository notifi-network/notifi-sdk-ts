import {
  EventTypeItem,
  FusionHealthCheckEventTypeItem,
  ThresholdDirection,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import { SubscriptionData, useNotifiSubscribe } from '../../hooks';
import {
  DeepPartialReadonly,
  fusionHealthCheckConfiguration,
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from '../../utils';
import type { NotifiToggleProps } from './NotifiToggle';
import { NotifiToggle } from './NotifiToggle';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

export type EventTypeFusionHealthCheckRowProps = Readonly<{
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
  config: FusionHealthCheckEventTypeItem;
  inputs: Record<string, unknown>;
}>;

const getParsedInputNumber = (input: string): number | null => {
  if (input.indexOf('%') === input.length - 1) {
    return parseFloat(input.slice(0, -1)) ?? null;
  }
  return null;
};

export const EventTypeFusionHealthCheckRow: React.FC<
  EventTypeFusionHealthCheckRowProps
> = ({ classNames, config, disabled, inputs }) => {
  const { alerts, loading, render } = useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

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
  const fusionEventId = useMemo(
    () => resolveStringRef(config.name, config.fusionEventId, inputs),
    [config, inputs],
  );

  const fusionSourceAddress = useMemo(
    () => resolveStringRef(config.name, config.sourceAddress, inputs),
    [config, inputs],
  );

  const alertName = useMemo<string>(() => {
    if (config.fusionEventId.type === 'value') {
      return config.name;
    }
    return `${config.name}:${fusionEventId}`;
  }, [config, fusionEventId]);

  const tooltipContent = config.tooltipContent;

  const UNABLE_TO_SUBSCRIBE = 'Unable to subscribe, please try again';
  const UNABLE_TO_UNSUBSCRIBE = 'Unable to unsubscribe, please try again';
  const INVALID_NUMBER = 'Please enter a valid number';

  const handleSuffixPercentage = (value: string) => {
    value = value.replace('%', '');
    setCustomValue(value + '%');
  };

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
        alertRatioValue =
          config.numberType === 'percentage'
            ? JSON.parse(alert.filterOptions).threshold * 100
            : JSON.parse(alert.filterOptions).threshold;
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
  }, [alertName, alerts, loading, enabled, setEnabled]);

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
      ratioNumber: number,
    ): Promise<SubscriptionData> => {
      if (isCanaryActive) {
        alertDetail.inputs[`${alertDetail.eventType.name}__healthRatio`] =
          ratioNumber;
        alertDetail.inputs[
          `${alertDetail.eventType.name}__healthThresholdDirection`
        ] = thresholdDirection;
        return subscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertConfiguration: fusionHealthCheckConfiguration({
            maintainSourceGroup: config?.maintainSourceGroup,
            fusionId: fusionEventId,
            fusionSourceAddress,
            alertFrequency: config.alertFrequency,
            thresholdDirection:
              config.checkRatios[0].type ?? thresholdDirection,
            threshold:
              config.numberType === 'percentage'
                ? ratioNumber / 100
                : ratioNumber,
          }),
          alertName,
        });
      }
    },
    [isCanaryActive, frontendClient],
  );

  const unSubscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs: Record<string, unknown>;
      }>,
    ) => {
      if (isCanaryActive) {
        return unsubscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertName: alertDetail.eventType.name,
          alertConfiguration: null,
        });
      }
    },
    [isCanaryActive, frontendClient],
  );

  const handleCustomRatioButtonNewSubscription = () => {
    if (loading || isNotificationLoading) {
      return;
    }

    const regex = new RegExp(
      config.numberType === 'percentage' ? /^[0-9.%]+$/ : /^[0-9.]+$/,
    );
    if (!customInputRef.current || !regex.test(customInputRef.current.value)) {
      return setErrorMessage(INVALID_NUMBER);
    }

    setErrorMessage('');
    setIsNotificationLoading(true);

    customInputRef.current.placeholder = 'Custom';

    const ratioNumber =
      config.numberType === 'percentage'
        ? getParsedInputNumber(customInputRef.current.value)
        : parseFloat(customInputRef.current.value);

    if (ratioNumber && ratioNumber >= 0 && ratioNumber <= 100 && customValue) {
      subscribeAlert({ eventType: config, inputs }, ratioNumber)
        .then(() => {
          setSelectedIndex(3);
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => setErrorMessage(UNABLE_TO_UNSUBSCRIBE))
        .finally(() => {
          setIsNotificationLoading(false);
        });
    } else {
      setErrorMessage(INVALID_NUMBER);
      setSelectedIndex(initialSelectedIndex);
      setIsNotificationLoading(false);
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
      subscribeAlert({ eventType: config, inputs }, value)
        .then(() => {
          isCanaryActive && frontendClient.fetchData().then(render);
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
      subscribeAlert({ eventType: config, inputs }, initialRatio)
        .then((res) => {
          // We update optimistically so we need to check if the alert exists.
          const responseHasAlert = res.alerts[alertName] !== undefined;
          if (responseHasAlert !== true) {
            setEnabled(false);
          }
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch((e) => {
          setErrorMessage(UNABLE_TO_SUBSCRIBE);
          setEnabled(false);
          throw e;
        })
        .finally(() => {
          setIsNotificationLoading(false);
        });
    } else {
      setEnabled(false);
      unSubscribeAlert({ eventType: config, inputs })
        .then((res) => {
          setCustomValue('');
          if (res) {
            const responseHasAlert = res.alerts[alertName] !== undefined;
            if (responseHasAlert !== false) {
              setEnabled(true);
            }
          }
          // Else, ensured by frontendClient
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch((e) => {
          setErrorMessage(UNABLE_TO_SUBSCRIBE);
          setEnabled(true);
          throw e;
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
                  config.numberType === 'percentage' ? '0.00%' : '0')
              }
              onClick={() => {
                setErrorMessage('');
                setSelectedIndex(null);
              }}
              disabled={isNotificationLoading}
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
                if (config.numberType === 'percentage') {
                  handleSuffixPercentage(e.target.value);
                } else {
                  setCustomValue(e.target.value ?? '');
                }
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
