import { ThresholdDirection } from '@notifi-network/notifi-core';
import {
  EventTypeItem,
  HealthCheckEventInputsWithCustomPercentage,
  HealthCheckEventInputsWithIndex,
  HealthCheckInputs,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import {
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from 'notifi-react-card/lib/utils/frontendClient';
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
import {
  CheckRatio,
  HealthCheckEventTypeItem,
  SubscriptionData,
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

const UNABLE_TO_SUBSCRIBE = 'Unable to subscribe, please try again';
const INVALID_NUMBER = 'Please enter a valid number';

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

const inputsValidator = (
  inputs: HealthCheckInputs,
): inputs is HealthCheckEventInputsWithIndex => {
  return 'index' in inputs;
};

export const EventTypeHealthCheckRow: React.FC<
  EventTypeHealthCheckRowProps
> = ({ classNames, config, disabled }: EventTypeHealthCheckRowProps) => {
  const customInputRef = useRef<HTMLInputElement>(null);
  const { alerts, loading, setLoading, render } =
    useNotifiSubscriptionContext();
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const {
    canary: { isActive: isCanaryActive, frontendClient },
  } = useNotifiClientContext();

  const [enabled, setEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const alertName = useMemo<string>(() => config.name, [config]);
  const tooltipContent = config.tooltipContent;

  const isValueType = config && config.checkRatios.type === 'value';
  let ratios: CheckRatio[] = [];
  let thresholdDirection: ThresholdDirection = 'below';
  if (isValueType) {
    ratios = config.checkRatios.value;
    thresholdDirection = ratios[0].type;
  }

  useEffect(() => {
    if (loading) {
      return;
    }
    const alert = alerts[alertName];
    const checkRatios = ratios.map((ratio) => ratio.ratio);
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
          setCustomValue(alertRatioValue * 100 + '%');
        }
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

  const subscribeAlert = useCallback(
    async (
      alertDetail: Readonly<{
        eventType: EventTypeItem;
        inputs:
          | HealthCheckEventInputsWithIndex
          | HealthCheckEventInputsWithCustomPercentage;
      }>,
    ): Promise<SubscriptionData> => {
      if (isCanaryActive) {
        return subscribeAlertByFrontendClient(frontendClient, alertDetail);
      } else {
        return instantSubscribe({
          alertConfiguration: healthThresholdConfiguration({
            alertFrequency: config.alertFrequency,
            percentage: inputsValidator(alertDetail.inputs)
              ? (alertDetail.inputs as HealthCheckEventInputsWithIndex).index
              : (
                  alertDetail.inputs as HealthCheckEventInputsWithCustomPercentage
                ).customPercentage,
            thresholdDirection: inputsValidator(alertDetail.inputs)
              ? thresholdDirection
              : alertDetail.inputs.thresholdDirection,
          }),
          alertName: alertName,
        });
      }
    },
    [isCanaryActive, frontendClient, config],
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

  const handleToggleNewSubscription = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    setErrorMessage('');
    if (!enabled && initialRatio !== null) {
      subscribeAlert({
        eventType: config,
        inputs: {
          index: 0,
        },
      })
        .then(() => {
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE))
        .finally(() => setLoading(false));
    } else {
      unSubscribeAlert({
        eventType: config,
        inputs: {},
      })
        .then(() => {
          setCustomValue('');
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE))
        .finally(() => setLoading(false));
    }
  }, [initialRatio, enabled, isValueType]);

  const handleRatioButtonNewSubscription = (value: number, index: number) => {
    if (loading) {
      return;
    }
    setErrorMessage('');
    if (value) {
      subscribeAlert({
        eventType: config,
        inputs: {
          index: index,
        },
      })
        .then(() => {
          setSelectedIndex(index);
          setCustomValue('');
          isCanaryActive && frontendClient.fetchData().then(render);
        })
        .catch(() => setErrorMessage(UNABLE_TO_SUBSCRIBE));
    } else {
      setErrorMessage(INVALID_NUMBER);
    }
  };

  const handleCustomRatioButtonNewSubscription = () => {
    if (loading) {
      return;
    }
    setErrorMessage('');
    if (customInputRef.current) {
      customInputRef.current.placeholder = 'Custom';
      const ratioNumber = getParsedInputNumber(customInputRef.current.value);
      if (
        ratioNumber &&
        ratioNumber >= 0 &&
        ratioNumber <= 100 &&
        customValue
      ) {
        subscribeAlert({
          eventType: config,
          inputs: {
            customPercentage: ratioNumber / 100,
            thresholdDirection,
          },
        })
          .then(() => {
            setSelectedIndex(3);
            isCanaryActive && frontendClient.fetchData().then(render);
          })
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
              ref={customInputRef}
              onKeyUp={(e) => handleKeypressUp(e)}
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
